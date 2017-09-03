import { compose } from "ramda";
import { Ticket } from "tracky-types";
import { outputFields as outputProjectFields } from "models/projects";
import { outputFields } from "./";

const getProject = (id: Ticket["id"], db) =>
  db.one(
    `
    SELECT $2:name FROM projects AS p
    INNER JOIN projects_tickets AS pt
    ON (pt.ticket_id = $1) AND (p.id = pt.project_id)
  `,
    [id, outputProjectFields]
  );

const getData = (id: Ticket["id"], db) =>
  db.one("SELECT $2:name FROM tickets WHERE id = $1", [id, outputFields]);

/**
 * Returns a single ticket
 * 
 * @param id ticket id
 * @param db database connection
 */
export default async (id: Ticket["id"], db) => {
  const ticket = await getData(id, db);
  const project = await getProject(id, db);

  return {
    ...ticket,
    project
  };
};