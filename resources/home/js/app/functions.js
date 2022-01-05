import Application from "./Application";
import Home from "./models/home";
import Broadcaster from "../socket/broadcaster";
import Dashboard from "./dashboard/dashboard";

export function app() { return Application.getInstance(); }

export function home() { return Home.getInstance(); }

export function broadcaster() { return Broadcaster.getInstance(); }

export function dashboard() { return Dashboard.getInstance(); }
