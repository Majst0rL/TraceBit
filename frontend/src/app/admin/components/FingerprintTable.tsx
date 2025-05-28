//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\components\FingerprintTable.tsx

interface Fingerprint {
  fingerprint_hash: string;
  browser_name: string;
  os_name: string;
  gpu_renderer: string;
  screen_resolution: string;
}

export default function FingerprintTable({ data }: { data: Fingerprint[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Hash</th>
            <th className="px-4 py-2 text-left">Browser</th>
            <th className="px-4 py-2 text-left">OS</th>
            <th className="px-4 py-2 text-left">GPU</th>
            <th className="px-4 py-2 text-left">Resolution</th>
          </tr>
        </thead>
        <tbody>
          {data.map((fp, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{fp.fingerprint_hash}</td>
              <td className="px-4 py-2">{fp.browser_name}</td>
              <td className="px-4 py-2">{fp.os_name}</td>
              <td className="px-4 py-2">{fp.gpu_renderer}</td>
              <td className="px-4 py-2">{fp.screen_resolution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
