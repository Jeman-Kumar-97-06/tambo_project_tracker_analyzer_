export default function TableView({ title, columns, rows }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-border bg-card rounded-lg">
          <thead className="bg-muted">
            <tr>
              {columns?.map((col) => (
                <th
                  key={col.key}
                  className="border-b border-border px-4 py-3 text-left font-semibold text-foreground first:rounded-tl-lg last:rounded-tr-lg"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-card">
            {rows?.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-card-foreground first:rounded-bl-lg last:rounded-br-lg"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
