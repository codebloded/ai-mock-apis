/**
 * @fileoverview This file serves file based routing for routes.
 * @date 06/Oct/2023
 * @author Copyright © 2024, Jenga Labs  All rights reserved.
 * @readonly
 * @protected
 */

// import { Boundary } from "@/components/ui/boundary";

import { Boundary } from "@/components/ui/boundary";
import { useRoutes } from "react-router";
import routes from "~react-pages";

// ** Creates Application routes based on file structure.
export default function MainRouter() {
  return <Boundary>{useRoutes(routes)}</Boundary>;
}
