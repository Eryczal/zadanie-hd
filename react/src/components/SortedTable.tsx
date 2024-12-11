import {
    alpha,
    Box,
    Button,
    Checkbox,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import React, { useEffect, useState } from "react";
import {
    Channel,
    EnhancedTableProps,
    EnhancedTableToolbarProps,
    HeadCell,
    Order,
    SortedTableProps,
} from "../types";
import { deleteChannels, editChannel } from "../channelApi";
import { modalStyle } from "../styles";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Nazwa",
    },
    {
        id: "number",
        numeric: true,
        disablePadding: false,
        label: "Ilość",
    },
];

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler =
        (property: keyof Channel) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "wybierz wszystkie kanały",
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sortowanie malejące"
                                        : "sortowanie rosnące"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected, reloadChannels } = props;

    const displaySelected = (num: number): string => {
        if (num === 1) {
            return `${num} zaznaczony`;
        } else if (num % 100 > 1 && num % 100 < 5) {
            return `${num} zaznaczone`;
        } else {
            return `${num} zaznaczonych`;
        }
    };

    const handleDelete = async (): Promise<void> => {
        try {
            const response = await deleteChannels(selected);

            reloadChannels();
        } catch (error) {}
    };

    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {displaySelected(numSelected)}
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Kanały
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Usuń" onClick={() => handleDelete()}>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

export default function SortedTable({
    rows,
    reloadChannels,
}: SortedTableProps) {
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Channel>("name");
    const [selected, setSelected] = useState<number[]>([]);
    const [openChannel, setOpenChannel] = useState<Channel | null>(null);
    const [page, setPage] = useState<number>(0);
    const [modalName, setModalName] = useState<string>("");
    const [modalNumber, setModalNumber] = useState<string>("");

    useEffect(() => {
        setSelected([]);
        setPage(0);
    }, [rows]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Channel
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const openModal = (channel: Channel): void => {
        setOpenChannel(channel);
        setModalName(channel.name);
        setModalNumber(channel.number.toString());
    };

    const clickEditChannel = async (): Promise<void> => {
        try {
            if (openChannel) {
                const response = await editChannel(
                    openChannel.id.toString(),
                    modalName,
                    modalNumber
                );

                if ((response.id, response.name, response.number)) {
                    reloadChannels();
                }
            }
        } catch (error) {}
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * 10 - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .sort(getComparator(order, orderBy))
                .slice(page * 10, page * 10 + 10),
        [order, orderBy, page, rows]
    );

    return (
        <Box sx={{ width: "fit-content", m: "auto", mt: 4 }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    selected={selected}
                    reloadChannels={reloadChannels}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 300 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(
                                    row.id
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => {
                                            openModal(row);
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                                onClick={(event) =>
                                                    handleClick(event, row.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.number}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={rows.length}
                    rowsPerPage={10}
                    rowsPerPageOptions={[]}
                    page={page}
                    onPageChange={handleChangePage}
                />
            </Paper>
            {openChannel !== null && (
                <Modal
                    open={openChannel !== null}
                    onClose={() => setOpenChannel(null)}
                >
                    <Box sx={modalStyle}>
                        <Typography variant="h4" component="h2">
                            Edytuj kanał
                        </Typography>
                        <Box sx={{ my: 4 }}>
                            <TextField
                                sx={{
                                    my: 2,
                                }}
                                id="outlined-basic"
                                label="Nazwa"
                                variant="outlined"
                                value={modalName}
                                onChange={(e) => setModalName(e.target.value)}
                            />
                            <TextField
                                sx={{
                                    my: 2,
                                }}
                                id="outlined-basic-2"
                                label="Ilość"
                                variant="outlined"
                                type="number"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={modalNumber}
                                onChange={(e) => setModalNumber(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => clickEditChannel()}
                        >
                            Zapisz
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
}
