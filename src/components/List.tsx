import React from "react";
import { useFindPetsByStatus } from "../api/pet/pet";
import { Link, ListItem, ListItemButton, List as MuiList } from "@mui/material";

export const List: React.FC = () => {
  const state = useFindPetsByStatus({
    status: "available",
  });

  if (state.isLoading) {
    return <>loading</>;
  }
  if (state.error) {
    return <>{state.error.message}</>;
  }
  if (!state.data || state.data.data.length === 0) {
    return <>データが存在しません</>;
  }
  return (
    <MuiList>
      {state.data.data.map((item, index) => (
        <ListItem key={item.id || index}>
          <ListItemButton href={`./?pet_id=${item.id}`} component={Link}>
            {item.name}
          </ListItemButton>
        </ListItem>
      ))}
    </MuiList>
  );
};