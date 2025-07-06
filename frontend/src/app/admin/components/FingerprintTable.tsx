// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\admin\components\FingerprintTable.tsx


interface Fingerprint {
  fingerprint_hash: string;
  browser_name: string;
  os_name: string;
  gpu_renderer: string;
  screen_resolution: string;
  suspicious?: boolean | string | number;
  suspicious_reason?: string;
}

/**
 * Robustly checks if a suspicious value means "true".
 * Accepts boolean, string ("true", "1", "TRUE"), and number (1).
 */
function isSuspicious(val: boolean | string | number | undefined): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;
  if (typeof val === "string") {
    const normalized = val.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  return false;
}

/**
 * Displays a table of fingerprints with suspicious status.
 */
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
            <th className="px-4 py-2 text-left">Suspicious</th>
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
              <td className="px-4 py-2">
                {isSuspicious(fp.suspicious) ? (
                  <span className="flex items-center text-red-600 font-bold" title={fp.suspicious_reason || ''}>
                    <span className="mr-1">⚠</span>
                    Suspicious
                    {fp.suspicious_reason && (
                      <span className="ml-2 text-xs text-red-800">{fp.suspicious_reason}</span>
                    )}
                  </span>
                ) : (
                  <span className="text-green-700 font-medium">Normal</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
