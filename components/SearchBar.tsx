'use client';


interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search AR glasses...",
  className = ""
}: SearchBarProps) {
  return (
    <div className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}