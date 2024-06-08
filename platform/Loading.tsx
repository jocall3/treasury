import React from "react";
import { createUseStyles } from "react-jss";
import { BeatLoader } from "react-spinners";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    justifyContent: "center",
  },
});

function Loading() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <BeatLoader color="#FFFFFF" size={8} />
    </div>
  );
}

export default Loading;
