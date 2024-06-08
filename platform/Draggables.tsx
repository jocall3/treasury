import React, { useEffect, useState } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { isEqual } from "lodash";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import useErrorBanner from "~/common/utilities/useErrorBanner";
import { useDispatchContext } from "../MessageProvider";

export type DraggableMutation = (id: string, sortableId: number) => void;
export type DraggableRefetch = (
  variables?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<ApolloQueryResult<any>>;
export interface DraggableProps {
  draggableId: string;
  index: number;
  trigger?: DraggablesProp;
}

export interface DraggablesProp {
  key: string;
  props: DraggableProps;
}

export interface SortableProp {
  node: {
    id: string;
    sortableId?: number;
    priority?: number;
  };
}

interface DragDropContextWrapperProps {
  draggableRefetch?: DraggableRefetch;
  draggableMutation: DraggableMutation;
  renderDataRows: () => React.JSX.Element | JSX.Element[];
}

const updatedDataIdSortableId = (arr: DraggablesProp[]) => {
  const obj = {};
  arr.forEach((node: { props: DraggableProps }) => {
    if (node && node.props) {
      // Account for trigger prop for drawer wrapped components
      const draggableId =
        node.props.draggableId || node.props.trigger?.props.draggableId;
      const index = node.props.index ?? node.props.trigger?.props.index;
      if (draggableId !== undefined) {
        obj[draggableId] = index;
      }
    }
  });
  return obj;
};

const refetchedDataSortableId = (arr: SortableProp[]) => {
  const obj = {};
  arr.forEach((edge) => {
    obj[edge.node.id] =
      edge.node.sortableId !== undefined
        ? edge.node.sortableId
        : edge.node.priority;
  });
  return obj;
};

const handleOnDragChange = (
  draggableRefetch: (
    variables?: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<ApolloQueryResult<any>>,
  setIsDraggableRefetchedDataSynced: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  dataRowItems: DraggablesProp[],
  dispatchError: (errorMessage: string) => void
) => {
  draggableRefetch?.()
    .then((response) => {
      const firstDataKey = Object.values(
        response.data as {
          [key: string]: {
            edges: SortableProp[];
          };
        }
      )[0];
      const edges = firstDataKey?.edges;
      if (edges) {
        setIsDraggableRefetchedDataSynced(
          isEqual(
            refetchedDataSortableId(edges),
            updatedDataIdSortableId(dataRowItems)
          )
        );
      }
    })
    .catch((error: Error) => dispatchError(error.message));
};

const handleOnDragEnd = (
  result: DropResult,
  draggableMutation: (id: string, sortableId: number) => void,
  isDraggableRefetchedDataSynced,
  dataRowItems: DraggablesProp[],
  setDataRowItems: React.Dispatch<
    React.SetStateAction<React.ReactNode | React.ReactNode[]>
  >
) => {
  if (draggableMutation) {
    const { destination, source } = result;
    if (!destination) return;

    if (isDraggableRefetchedDataSynced) {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const itemsArray = Array.isArray(dataRowItems)
        ? dataRowItems
        : [dataRowItems];

      const items = itemsArray.filter(React.isValidElement);

      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, newIndex) => {
        if (
          React.isValidElement(item) &&
          typeof item?.props === "object" &&
          item?.props !== null
        ) {
          // Handling item.props.trigger for drawer wrapped components
          const elementToClone = React.isValidElement(item.props.trigger)
            ? item.props.trigger
            : item;
          return React.cloneElement(elementToClone, {
            ...elementToClone.props,
            index: newIndex,
          } as DraggableProps);
        }
        return item;
      });

      setDataRowItems(updatedItems);

      draggableMutation(result.draggableId, destination.index);
    }
  }
};

export function DragDropContextWrapper({
  draggableRefetch,
  draggableMutation,
  renderDataRows,
}: DragDropContextWrapperProps) {
  const [isDraggableRefetchedDataSynced, setIsDraggableRefetchedDataSynced] =
    useState(true);

  // Ensures draggable data stays in sync and is not altered by multiple parties at one time
  const flashError = useErrorBanner();

  useEffect(() => {
    if (!isDraggableRefetchedDataSynced) {
      flashError("Data is out of sync. Please refresh the page and try again.");
    }
  }, [isDraggableRefetchedDataSynced, flashError]);

  const [dataRowItems, setDataRowItems] = useState<
    React.ReactNode | React.ReactNode[]
  >(renderDataRows());

  const { dispatchError } = useDispatchContext();

  return (
    <DragDropContext
      onBeforeDragStart={() => {
        if (draggableRefetch) {
          handleOnDragChange(
            draggableRefetch,
            setIsDraggableRefetchedDataSynced,
            dataRowItems as DraggablesProp[],
            dispatchError
          );
        }
      }}
      onDragUpdate={() => {
        if (draggableRefetch) {
          handleOnDragChange(
            draggableRefetch,
            setIsDraggableRefetchedDataSynced,
            dataRowItems as DraggablesProp[],
            dispatchError
          );
        }
      }}
      onDragEnd={(result) => {
        handleOnDragEnd(
          result,
          draggableMutation,
          isDraggableRefetchedDataSynced,
          dataRowItems as DraggablesProp[],
          setDataRowItems
        );
      }}
    >
      <Droppable droppableId="approvals">
        {(provided) => (
          <div
            className="rb_index-table-row rb_table-row"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {dataRowItems}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
