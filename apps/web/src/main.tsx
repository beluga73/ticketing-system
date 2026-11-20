import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from "@/pages/sign-up";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/sign-up" element={<SignUp />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
