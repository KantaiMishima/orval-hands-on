# ハンズオンの内容

## 「1. プロジェクト作成」

> mkdir orval-hands-on

> cd orval-hands-on

> npm create vite@latest . -- --template react-ts

↑ 基本対話形式の設定はそのままEnterで問題ないです

## 「2. api ファイル生成」の内容

### api ファイル作成

#### 依存関係を install

> npm i --save orval msw @faker-js/faker -D

> npm i --save axios swr

> mkdir docs

#### 今回の対象の openapi を用意

以下から「https://petstore3.swagger.io/api/v3/openapi.json 」をダウンロードして docs 配下に配置
https://petstore3.swagger.io/

#### orval による生成

orval.config.cjs

```
module.exports = {
 "petstore-file": {
   input: "./docs/openapi.yml",
   output: {
     mode: "tags-split",
     target: "src/api/petstore.ts",
     baseUrl: "https://petstore3.swagger.io/api/v3",
     schemas: "./src/api/model",
     mock: true,
     client: "swr",
   },
 },
};
```

#### package.json の scripts に追加

```
    "orval": "orval",
```

> npm run orval

## 「3. 取得処理を作成：一覧表示」の内容

### 取得処理を作成：一覧表示

#### 依存関係を install

> npm i --save @mui/material @emotion/react @emotion/styled

#### コードを記述

src/main.tsx から```import './index.css'を削除

```bash
mkdir src/components
```

src/components/List.tsx

```src/components/List.tsx
import React from "react";
import { useFindPetsByStatus } from "../api/pet/pet";
import { ListItem, List as MuiList } from "@mui/material";

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
          {item.name}
        </ListItem>
      ))}
    </MuiList>
  );
};
```

src/App.tsx

```src/App.tsx
import { List } from "./components/List";
import { Container } from "@mui/material";

function App() {
  return (
    <Container maxWidth="sm">
      <List />
    </Container>
  );
}

export default App;
```

## 「4. フォーム作成：値を取得して表示する」の内容

### フォーム作成：値を取得して表示する

#### コードを記述

src/components/List.tsx

```src/components/List.tsx
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
```

src/components/Detail.tsx

```src/components/Detail.tsx
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
```

src/App.tsx

```src/App.tsx
import { List } from "./components/List";
import { Detail } from "./components/Detail";
import { Container } from "@mui/material";

function App() {
  const petId = new URLSearchParams(window.location.search).get("pet_id");
  if (petId) {
    return (
      <Container maxWidth="sm">
        <Detail petId={Number(petId)} />
      </Container>
    );
  }
  return (
    <Container maxWidth="sm">
      <List />
    </Container>
  );
}

export default App;
```

## 「5. フォーム作成：値を取得して編集できるようにする」の内容

### フォーム作成：値を取得して編集できるようにする

#### コードを記述

src/components/Detail.tsx

```src/components/Detail.tsx
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
```

## 「6. フォーム作成：フォームの値を送信する」の内容

### フォーム作成：フォームの値を送信する

#### 依存関係を install

> npm i --save final-form react-final-form

#### コードを記述

src/components/Detail.tsx

```src/components/Detail.tsx
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
```

## 「7. validate 生成」の内容

### validate 生成

#### 依存関係を install

> npm i --save zod

#### orval を編集・再実行

orval.config.cjs に以下を追記

```orval.config.cjs
module.exports = {
  "petstore-file": {
    input: "./docs/openapi.yml",
    output: {
      mode: "tags-split",
      target: "src/api/petstore.ts",
      baseUrl: "https://petstore3.swagger.io/api/v3",
      schemas: "./src/api/model",
      mock: true,
      client: "swr",
    },
  },
  // 追記
  "petstore-zod": {
    input: {
      target: "./docs/openapi.yml",
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/api/petstore.zod.ts',
      fileExtension: '.zod.ts',
    },
  },
};
```

orval を再実行

> npm run orval

#### validate 処理を react final form 向けに wrap する関数を作成

> mkdir src/lib

src/lib/validate.ts

```src/lib/validate.ts
import zod from "zod";

export const generateValidatorByZod = <T>(schema: zod.ZodType<T>) => {
  return (values: unknown): string => {
    const result = schema.safeParse(values);
    if (result.success) {
      return "";
    } else {
      return zod.prettifyError(result.error);
    }
  };
}
```

#### それぞれの field に validate を設置

src/components/Detail.tsx

```tsx
import { generateValidatorByZod } from "../lib/validate";
import { updatePetBody } from "../api/pet/pet.zod";
```

```tsx
          <Field name="name" validate={generateValidatorByZod(updatePetBody.shape.name)}>
```

```tsx
          <Field name="status" validate={generateValidatorByZod(updatePetBody.shape.status)}>
```

##### お試し

src/components/Detail.tsx のstatusに以下を追加

```tsx
                <MenuItem value={"hogehoge"}>hogehoge</MenuItem>
```

画面上でこの値を選択するとエラー
