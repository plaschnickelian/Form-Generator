import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deDE } from '@mui/x-date-pickers/locales';

const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    deDE, // x-date-pickers translations
  );

const Datepicker = ({ selected, onChange, label, name, minDate, maxDate }) => {
    const [error, setError] = useState("");

    return (
        <Form.Group className={`mb-1 mt-1 ${label ? "floating-label-container" : ""}`} controlId="formBasicData">
            <LocalizationProvider dateAdapter={AdapterDayjs} localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}>
                <DemoContainer components={['DatePicker']}>
                    <ThemeProvider theme={theme}>
                    <DatePicker
                        label={label}
                        selected={selected}
                        minDate={minDate}
                        maxDate={maxDate}
                        format="DD/MM/YYYY"
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            }
                        }}
                        onChange={(value) => {
                            onChange({ target: { name: name, value: value } });
                            setError("");
                        }}
                    />
                    </ThemeProvider>
                </DemoContainer>
            </LocalizationProvider>
        </Form.Group>
    );
}

export default Datepicker