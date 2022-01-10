import React from "react";
import "./App.css";
import CustomSelect from "./components/form-elements/select/CustomSelect";

function App() {
  return (
    <div className="App">
      <CustomSelect
        options={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ]}
        onChange={(value) => console.log(value)}
        variant="primary"
      />
    </div>
  );
}

export default App;
