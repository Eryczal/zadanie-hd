export interface Channel {
    id: number;
    name: string;
    number: string;
    created_at: string;
    updated_at: string;
}

export interface ChartData {
    label: string;
    value: number;
}

export interface Response {
    message: string;
}

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Channel;
    label: string;
    numeric: boolean;
}

export type Order = "asc" | "desc";

export interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Channel
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export interface EnhancedTableToolbarProps {
    numSelected: number;
    selected: number[];
    reloadChannels: () => void;
}

export interface SortedTableProps {
    rows: Channel[];
    reloadChannels: () => void;
}
