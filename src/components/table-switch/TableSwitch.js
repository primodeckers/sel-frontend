import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';

export default function TableSwitch(){

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Paper square={false} elevation={0}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="PR" />
                <Tab label="VPR" />
                <Tab label="ESCAV" />
                <Tab label="PR Exercício" />
            </Tabs>
        </Paper>
    )
}