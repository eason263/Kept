import { redirect } from "next/navigation";

/** The workbench opens on the laser portrait. */
export default function CustomIndex() {
  redirect("/custom/laser-portrait");
}
