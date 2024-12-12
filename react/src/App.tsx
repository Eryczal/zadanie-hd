import { useEffect, useState } from "react";
import { Channel, ChartData } from "./types";
import { addChannel, getChannels } from "./channelApi";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SortedTable from "./components/SortedTable";
import { modalStyle } from "./styles";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";

function App() {
    const [channels, setChannels] = useState<null | Channel[]>(null);
    const [chartValue, setChartValue] = useState<null | ChartData[]>(null);
    const [reload, setReload] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [number, setNumber] = useState<string>("");

    const mobile: boolean = window.innerWidth < 600;

    const size = {
        width: mobile ? window.innerWidth : 600,
        height: mobile ? window.innerWidth * 1.4 : 300,
    };

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const data = await getChannels();

            setChannels(data);

            setReload(false);
        };

        if (reload) {
            loadData();
        }
    }, [reload]);

    useEffect(() => {
        if (channels) {
            const total = channels.reduce(
                (sum, item) => sum + parseInt(item.number),
                0
            );
            setChartValue(
                channels.map((item) => ({
                    label: item.name,
                    value:
                        total > 0 ? (parseInt(item.number) / total) * 100 : 0,
                }))
            );
        }
    }, [channels]);

    const reloadChannels = (): void => {
        setReload(true);
    };

    const clickAddChannel = async (): Promise<void> => {
        try {
            const data = await addChannel(name, number);

            if ((data.id, data.name, data.number)) {
                setChannels((oldChannels) => [...(oldChannels ?? []), data]);
                setName("");
                setNumber("");
                setIsOpen(false);
            }
        } catch (error) {}
    };

    if (!channels || !chartValue) {
        return <>Wczytywanie danych...</>;
    }

    return (
        <div>
            <Grid
                container
                gap={2}
                sx={{
                    justifyContent: "center",
                    mt: 6,
                }}
            >
                <div style={{ flexGrow: 0 }}>
                    <SortedTable
                        rows={channels}
                        reloadChannels={reloadChannels}
                    />
                    <div style={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            onClick={() => setIsOpen(true)}
                            sx={{ mt: 2 }}
                        >
                            Dodaj kanał
                        </Button>
                    </div>
                </div>
                <div style={{ flexGrow: 0 }}>
                    <PieChart
                        series={[
                            {
                                arcLabel: (item) => `${item.value.toFixed(2)}%`,
                                arcLabelMinAngle: 30,
                                arcLabelRadius: "60%",
                                data: chartValue,
                                valueFormatter: (item: { value: number }) =>
                                    `${item.value.toFixed(2)}%`,
                                cx: mobile ? window.innerWidth / 2 : "50%",
                            },
                        ]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: "bold",
                            },
                        }}
                        slotProps={{
                            legend: {
                                direction: mobile ? "row" : "column",
                                position: {
                                    vertical: mobile ? "bottom" : "middle",
                                    horizontal: mobile ? "middle" : "right",
                                },
                            },
                        }}
                        {...size}
                    ></PieChart>
                </div>
            </Grid>
            {isOpen && (
                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h4" component="h2">
                            Kanał
                        </Typography>
                        <Box sx={{ my: 4 }}>
                            <TextField
                                sx={{
                                    my: 2,
                                }}
                                id="outlined-basic"
                                label="Nazwa"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => clickAddChannel()}
                        >
                            Dodaj
                        </Button>
                    </Box>
                </Modal>
            )}
        </div>
    );
}

export default App;
