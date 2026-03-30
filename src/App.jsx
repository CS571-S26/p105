import { Route } from "react-router";
import Navbar from "./components/layout/navbar";
import { Button } from "react-aria-components";
import { Breadcrumb, Breadcrumbs } from "react-aria-components";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Button>hello charles</Button>
      <Breadcrumbs>
        <Breadcrumb href="#">Home</Breadcrumb>
        <Breadcrumb href="#">React Aria</Breadcrumb>
        <Breadcrumb>Breadcrumbs</Breadcrumb>
      </Breadcrumbs>
    </div>
  );
}

export default App;
