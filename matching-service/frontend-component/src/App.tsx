import React, { useState } from "react";
import MatchUI from "./components/MatchUI";
import { Button, Textarea } from "@nextui-org/react";

const App: React.FC = () => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  const updateLocalJwt = (value: string) => {
    console.log("Updating JWT in localStorage to:", value);
    localStorage.setItem("jwt", value);
  };

  return (
    <div>
      {isMatchUIVisible && <MatchUI onClose={handleClose} />}
      <Button onClick={() => setIsMatchUIVisible(true)} variant="solid">
        Open MatchUI
      </Button>
      <Textarea
        label="JSONWebToken"
        placeholder=""
        className="max-w-xs"
        onValueChange={updateLocalJwt}
      />
    </div>
  );
};

export default App;
