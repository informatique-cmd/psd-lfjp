import React, { useEffect, useMemo, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchIndex } from '@/data/searchIndex';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const filteredItems = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return searchIndex;
    }

    return searchIndex.filter(({ title, description, keywords }) =>
      [title, description, ...keywords].some((field) =>
        field.toLowerCase().includes(normalized)
      )
    );
  }, [searchTerm]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Recherchez une page, un axe, un projet..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat ne correspond à votre recherche.</CommandEmpty>
        <CommandGroup heading="Pages">
          {filteredItems.map((item) => (
            <CommandItem
              key={item.path}
              value={`${item.title} ${item.description} ${item.keywords.join(' ')}`}
              onSelect={() => handleSelect(item.path)}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.category} • {item.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
