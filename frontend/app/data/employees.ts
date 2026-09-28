export type WorkerType = "Employee" | "Contractor";

export type Employee = {
  /** Numeric worker identifier, rendered as `#4586936`. */
  workerId: string;
  name: string;
  email: string;
  role: string;
  workerType: WorkerType;
};

/** Two-letter avatar fallback derived from a full name. */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const EMPLOYEES: Employee[] = [
  {
    workerId: "4586936",
    name: "Alex Turner",
    email: "alex@acme.com",
    role: "Product Manager",
    workerType: "Employee",
  },
  {
    workerId: "4586937",
    name: "Emma Davis",
    email: "emma@acme.com",
    role: "Senior Designer",
    workerType: "Employee",
  },
  {
    workerId: "4586933",
    name: "John Smith",
    email: "john@acme.com",
    role: "Chief Technology Officer",
    workerType: "Employee",
  },
  {
    workerId: "4586932",
    name: "Kate Moore",
    email: "kate@acme.com",
    role: "Chief Executive Officer",
    workerType: "Employee",
  },
  {
    workerId: "4586935",
    name: "Mike Wilson",
    email: "mike@acme.com",
    role: "VP of Engineering",
    workerType: "Employee",
  },
  {
    workerId: "4586934",
    name: "Sara Johnson",
    email: "sara@acme.com",
    role: "Chief Marketing Officer",
    workerType: "Employee",
  },
  {
    workerId: "4586938",
    name: "Priya Nair",
    email: "priya@acme.com",
    role: "Data Scientist",
    workerType: "Employee",
  },
  {
    workerId: "4586939",
    name: "Diego Alvarez",
    email: "diego@acme.com",
    role: "Backend Engineer",
    workerType: "Contractor",
  },
  {
    workerId: "4586940",
    name: "Yuki Tanaka",
    email: "yuki@acme.com",
    role: "People Operations Lead",
    workerType: "Employee",
  },
  {
    workerId: "4586941",
    name: "Liam O'Brien",
    email: "liam@acme.com",
    role: "Technical Recruiter",
    workerType: "Contractor",
  },
];
