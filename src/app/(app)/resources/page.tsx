export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recursos</h1>
        <p className="text-slate-500">Material de apoyo y documentación.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400">
                Recurso #{i}
            </div>
        ))}
      </div>
    </div>
  );
}
