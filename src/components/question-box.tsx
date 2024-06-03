import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
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
        <Box mb={2}>
            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <Typography variant="h6">{question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">{answer}</Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
