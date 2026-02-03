import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CRMTable() {
  const users = [
    { id: 1, name: "Valentina Muñoz", org: "Fundación Summer", score: 78, status: "Activo", lastSeen: "Hace 2h" },
    { id: 2, name: "Carlos Pérez", org: "Liceo 1", score: 45, status: "Pendiente", lastSeen: "Hace 1d" },
    { id: 3, name: "Ana Silva", org: "Colegio B", score: 92, status: "Activo", lastSeen: "Hace 5m" },
    { id: 4, name: "Roberto Díaz", org: "ONG Local", score: 12, status: "Inactivo", lastSeen: "Hace 1w" },
  ];

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Organización</TableHead>
            <TableHead>Oasis Score</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Última Conexión</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <Avatar className="h-8 w-8">
                   <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                   <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.name}
              </TableCell>
              <TableCell>{user.org}</TableCell>
              <TableCell>
                <Badge variant="outline" className={user.score > 50 ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-100"}>
                    {user.score}/100
                </Badge>
              </TableCell>
              <TableCell>
                 <span className={user.status === 'Activo' ? 'text-green-600 font-medium text-xs' : 'text-slate-400 text-xs'}>
                     {user.status}
                 </span>
              </TableCell>
              <TableCell className="text-right text-slate-500 text-xs">{user.lastSeen}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
