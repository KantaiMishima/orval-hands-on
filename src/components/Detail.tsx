import React from "react";
import { useGetPetById } from "../api/pet/pet";

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
  return <div>{pet.name}</div>;
};