import * as React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface QuestionAnswerBoxProps {
    question: string;
    answer: string;
    expanded: boolean;
    handleChange: () => void;
}

export function QuestionAnswerBox({
    question,
    answer,
    expanded,
    handleChange,
}: QuestionAnswerBoxProps) {
    return (
        <Container
            maxWidth="lg"
            sx={{
                marginBottom: 2,
                width: '80%',
            }}
        >
            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <Typography variant="h5">{question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{answer}</Typography>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
}
