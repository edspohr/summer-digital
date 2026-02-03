import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore"; // This is a server component, but we can't use hooks directly if we want mock data. 
// Actually for mock purposes, let's just make this client side or mock static.
// Let's make it a client component wrapper or just static.

export default function ProfilePage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-500">Gestiona tu información personal.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
                <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 mb-2">Nombre</p>
                <p className="font-medium mb-4">Valentina Muñoz</p>
                
                <p className="text-sm text-slate-500 mb-2">Email</p>
                <p className="font-medium mb-4">valentina@fundacionsummer.cl</p>

                <p className="text-sm text-slate-500 mb-2">Rol</p>
                <p className="font-medium">Participante</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
