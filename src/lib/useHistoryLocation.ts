import { useEffect, useState } from "react";
import type { Location } from "history";
import { useHistory } from "react-router-dom";

export const useHistoryLocation = (): Location => {
  const history = useHistory();
  const [location, setLocation] = useState<Location>(history.location);

  useEffect(() => {
    const unlisten = history.listen((nextLocation) => {
      setLocation(nextLocation);
    });

    return unlisten;
  }, [history]);

  return location;
};
