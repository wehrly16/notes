import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import NewNote from "./containers/NewNote.tsx";
import Login from "./containers/Login.tsx";
import Signup from "./containers/Signup.tsx";
import Notes from "./containers/Notes.tsx";
import Checklists from "./containers/ChecklistItems.tsx";
import NewChecklist from "./containers/NewChecklist.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import ChecklistItems from "./containers/ChecklistItems.tsx";
import NewChecklistItem from "./containers/NewChecklistItem.tsx";
import UpdateChecklistItems from "./containers/UpdateChecklistItems.tsx";

export default function Links() {
 
 return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
  path="/login"
  element={
    <UnauthenticatedRoute>
      <Login />
    </UnauthenticatedRoute>
  }
/>
<Route
  path="/signup"
  element={
    <UnauthenticatedRoute>
      <Signup />
    </UnauthenticatedRoute>
  }
/>
<Route
  path="/notes/new"
  element={
    <AuthenticatedRoute>
      <NewNote />
    </AuthenticatedRoute>
  }
/>
<Route
  path="/notes/:id"
  element={
    <AuthenticatedRoute>
      <Notes />
    </AuthenticatedRoute>
  }
/>
<Route
  path ="/checklists"
  element={
    <AuthenticatedRoute>
      <Checklists />     
    </AuthenticatedRoute>
  }
/>
<Route 
  path ="/checklists/new" 
  element={
    <AuthenticatedRoute>
      <NewChecklist />
    </AuthenticatedRoute>
  } 
  />
  <Route
  path="/checklists/:id/items"
  element={
    <AuthenticatedRoute>
      <ChecklistItems />
    </AuthenticatedRoute>
  }
/>
<Route
  path="/checklists/:id/items/:itemId"
  element={
    <AuthenticatedRoute>
      <UpdateChecklistItems />
    </AuthenticatedRoute>
  }
/>
<Route
  path="/checklists/:id/items/new"
  element={
    <AuthenticatedRoute>
      <NewChecklistItem />
    </AuthenticatedRoute>
  }
/>

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;      
    </Routes>
  );
}
