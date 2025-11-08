
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