'use client';

interface JsonRenderProps {
  data: unknown;
}

// Reusable recursive component for rendering read-only form from JSON
const RenderJsonAsForm = ({ data }: JsonRenderProps) => {
  const renderFields = (obj: Record<string, unknown>, parentKey = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <div key={fullKey} className="mb-4">
            <label className="block text-gray-800 font-semibold mb-2 capitalize">
              {key}
            </label>
            <div className="pl-4 border-l-2 border-gray-300">
              {renderFields(value as Record<string, unknown>, fullKey)}
            </div>
          </div>
        );
      }

      return (
        <div key={fullKey} className="mb-4">
          <label className="block text-gray-700 capitalize">{key}</label>
          <input
            type="text"
            value={String(value)}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      );
    });
  };

  return <form className="space-y-2">{renderFields(data as Record<string, unknown>)}</form>;
};

export default RenderJsonAsForm;
