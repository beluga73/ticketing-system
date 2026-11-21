import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from "@/pages/sign-up";
import "./index.css";
import { ProtectedRoute } from "./components/protected-route";
import { SessionProvider } from "./providers/session-provider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<SessionProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<p>hi</p>
							</ProtectedRoute>
						}
					/>
					<Route path="/sign-up" element={<SignUp />} />
				</Routes>
			</BrowserRouter>
		</SessionProvider>
	</StrictMode>,
);
