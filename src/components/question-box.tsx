import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface QuestionAnswerBoxProps {
    question: string;
    answer: string;
    expanded: boolean;
    handleChange: () => void;
    lastUpdated?: Date;
}

export function QuestionAnswerBox({
    question,
    answer,
    expanded,
    handleChange,
    lastUpdated,
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
                    <Typography variant="subtitle1">{answer}</Typography>
                </AccordionDetails>
                {lastUpdated && (
                    <AccordionDetails
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            color="gray"
                            variant="caption"
                            style={{ fontStyle: 'italic' }}
                        >{`Last Updated: ${lastUpdated.toDateString()}`}</Typography>
                    </AccordionDetails>
                )}
            </Accordion>
        </Box>
    );
}
