import React from "react";
import { useGetPetById } from "../api/pet/pet";
import type { Pet, PetStatus } from "../api/model";
import {
  Avatar,
  Button,
  Grid,
  Link,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const PetForm = ({
  values
}: { values: Pet }) => {
  return (
    <Grid container direction="column" alignItems="start" spacing={4}>
      <Grid>
        <Avatar src={values.photoUrls?.[0]} alt={values.name} />
      </Grid>
      <Grid>
        <TextField
            value={values.name}
            label="名前"
        />
      </Grid>
      <Grid>
        <Select value={values.status} label="ステータス">
          <MenuItem value={"available" as PetStatus}>購入可能</MenuItem>
          <MenuItem value={"pending" as PetStatus}>入荷待ち</MenuItem>
          <MenuItem value={"sold" as PetStatus}>売り切れ</MenuItem>
        </Select>
      </Grid>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" LinkComponent={Link} href="/">
            キャンセル
          </Button>
        </Grid>
        <Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            保存
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const Detail: React.FC<{
  petId: number;
}> = ({ petId }) => {
  const state = useGetPetById(petId, {
    swr: { revalidateOnFocus: false },
  });

  if (state.isLoading) {
    return <>loading</>;
  }
  if (state.error) {
    return <>{state.error.message}</>;
  }
  if (!state.data) {
    return <>データが存在しません</>;
  }
  const pet = state.data.data;
  return <PetForm values={pet} />;
};