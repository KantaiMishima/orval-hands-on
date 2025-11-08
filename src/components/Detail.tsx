import React from "react";
import { useGetPetById, useUpdatePet } from "../api/pet/pet";
import type { Pet, PetStatus } from "../api/model";
import {
  Avatar,
  Button,
  Grid,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, type FormRenderProps } from "react-final-form";
import { useCallback } from "react";
import type { Config } from "final-form";
import axios from "axios";

const PetForm = ({
  values,
  handleSubmit,
  invalid,
  dirty,
}: FormRenderProps<Pet>) => {
  return (
    <Grid container direction="column" alignItems="start" spacing={4}>
      <Grid>
        <Avatar src={values?.photoUrls?.[0]} alt={values?.name} />
      </Grid>
      <Grid>
        <Field name="name">
          {({ input, meta }) => (
            <TextField
              {...input}
              label="名前"
              error={Boolean(meta.error)}
              helperText={meta.error}
            />
          )}
        </Field>
      </Grid>
      <Grid>
        <Field name="status">
          {({ input, meta }) => (
            <>
              <Select {...input} label="ステータス" error={Boolean(meta.error)}>
                <MenuItem value={"available" as PetStatus}>購入可能</MenuItem>
                <MenuItem value={"pending" as PetStatus}>入荷待ち</MenuItem>
                <MenuItem value={"sold" as PetStatus}>売り切れ</MenuItem>
              </Select>
              {meta.error && (
                <Typography style={{ color: "red", marginTop: "0.5rem" }}>
                  {meta.error}
                </Typography>
              )}
            </>
          )}
        </Field>
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
            onClick={handleSubmit}
            disabled={invalid || !dirty}
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
  const mutation = useUpdatePet();

  const updatePet: Config<Pet>["onSubmit"] = useCallback(
    async (values, formApi, _callback) => {
      try {
        const { data } = await mutation.trigger(values);
        formApi.reset(data);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          // 雑にエラー表示
          window.alert(e.message);
        } else {
          window.alert(
            "予期せぬエラーが発生しました。時間をおいて再実行してください。"
          );
        }
      }
    },
    [mutation.trigger]
  );

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
  return <Form initialValues={pet} onSubmit={updatePet} render={PetForm} />;
};