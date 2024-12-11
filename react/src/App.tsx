import { useEffect, useState } from "react";
import "./App.css";
import { Channel } from "./types";
import { addChannel, getChannels } from "./channelApi";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

function App() {
    const [channels, setChannels] = useState<null | Channel[]>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [number, setNumber] = useState<string>();

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const data = await getChannels();

            setChannels(data);
        };

        loadData();
    }, []);

    if (!channels) {
        return <>Wczytywanie danych...</>;
    }

    return (
        <div>
            <Button variant="contained" onClick={() => setIsOpen(true)}>
                Dodaj kanał
            </Button>
            {isOpen && (
                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h4" component="h2">
                            Kanał
                        </Typography>
                        <Box>
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
                            onClick={() => addChannel(name, number)}
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
