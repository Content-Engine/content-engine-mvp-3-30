
import { useState } from 'react';
import { Link2, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PasteLinkInputProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

const PasteLinkInput = ({ value, onChange, loading, onSubmit }: PasteLinkInputProps) => {
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(url.length > 0 ? false : null);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateUrl(newValue);
  };

  const handleSubmit = () => {
    if (validateUrl(value) && !loading) {
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getBorderClass = () => {
    if (loading) return 'border-blue-500/50 shadow-lg shadow-blue-500/20';
    if (focused) return 'border-blue-500/50 shadow-lg shadow-blue-500/20';
    if (isValid === false) return 'border-red-500/50 shadow-lg shadow-red-500/20';
    if (isValid === true) return 'border-emerald-500/50 shadow-lg shadow-emerald-500/20';
    return 'border-slate-600/30';
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Link2 className="w-5 h-5 text-slate-400" />
        </div>
        
        <input
          type="url"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder="Paste your content URL here..."
          className={`
            w-full pl-12 pr-16 py-4 bg-slate-800/50 backdrop-blur-sm 
            border-2 rounded-xl text-slate-50 placeholder-slate-500
            transition-all duration-300 focus:outline-none
            ${getBorderClass()}
          `}
          disabled={loading}
        />
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          )}
          {!loading && isValid === true && (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          )}
          {!loading && isValid === false && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!value || loading || isValid === false}
        className={`
          w-full bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-sm 
          border border-blue-500/50 rounded-xl px-6 py-3 text-slate-50 font-medium 
          transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${!loading && isValid === true ? 'hover:from-blue-500 hover:to-blue-600' : ''}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Fetching Content...
          </span>
        ) : (
          'Import Content'
        )}
      </button>
    </div>
  );
};

export default PasteLinkInput;
