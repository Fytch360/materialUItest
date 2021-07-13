import Login from "./components/login";
import Layout from "./components/layout";
import { QueryClient, QueryClientProvider, QueryCache } from "react-query";
import { Router, Route, useHistory } from 'react-router-dom';

 const queryClient = new QueryClient();
 const queryCache = new QueryCache();
 const token = localStorage.getItem("token");


function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
      {token === null ? <Login /> : <Layout /> }
      </QueryClientProvider>
    </div>
  );
}

export default App;
