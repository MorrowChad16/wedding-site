import { useState } from 'react';
import { QuestionAnswerBox } from '../components/question-box';
import PageContainer from '../components/page-container';
import { Box } from '@mui/material';

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    lastUpdated?: Date;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'q1',
        question: 'How should I book my travel and stay?',
        answer: 'You can book it wherever your heart desires. We personally recommend looking on AirBnB and Google Hotels. If you want any recommendations on areas to stay, let us know.',
    },
    {
        id: 'q2',
        question: 'What is the schedule of events for the wedding?',
        answer: 'To Be Determined', // Add: ceremony, cocktail hour, reception
        lastUpdated: new Date(2024, 6, 26),
    },
    {
        id: 'q3',
        question: 'What is the dress code of the wedding?',
        answer: "The wedding will have a formal dress code. We are asking women wear midi to floor length dresses. Satins and pastels are encouraged. We're asking men wear button ups and jackets. Ties are optional. No jeans, flannels or plaid. Kids can wear basically whatever they want. Thank you!",
    },
    {
        id: 'q4',
        question: 'Where will the wedding and ceremony be?',
        answer: 'It will be at Stone Crossing in Boise Idaho. If you need more info head to the "Schedule" tab.',
    },
    // { id: 'q6', question: 'When do I need to RSVP by?', answer: '...' },
    {
        id: 'q7',
        question: 'Can I bring a date?',
        answer: "Yes we are allowing +1's. We just ask you be cognizant of who you bring.",
    },
    {
        id: 'q8',
        question: 'Can we bring our children?',
        answer: "Yes, we are having a kid friendly event. For the ceremony, we are looking into caretakers for all children who aren't in the ceremony.",
    },
    {
        id: 'q9',
        question: 'I have a dietary restriction, will there be food for me?',
        answer: "Nope, sorry. Better luck next wedding. Just kidding. We will! We'll have more details on the option very soon!",
        lastUpdated: new Date(2024, 6, 26),
    },
    {
        id: 'q10',
        question: 'Is there parking available?',
        answer: "Yes. There will be parking at the event. We just ask every car is off the lot by the end of the night. The venue doesn't want cars staying overnight.",
    },
    {
        id: 'q11',
        question: 'Is there a shuttle service?',
        answer: 'After talking with the venue and researching local options, we have decided not use a general shuttle service. The Hotel "Hilton Garden Inn Boise/Eagle" offers a shuttle service if we get 10 guests who stay at this hotel. We will keep you updated. Uber and Lyft are very convenient and cheap in the Boise area. If any special accomodation is needed, please let us know.',
    },
    {
        id: 'q12',
        question: 'Can I take pictures during the ceremony?',
        answer: 'Unless you want your hand cut off, no. We will have a photographer and videographer there at the event handling everything. We will share the pictures with everyone. Once we head to the reception, please feel free to take as many pictures as you want.',
    },
    {
        id: 'q13',
        question: 'Will there be drinks available?',
        answer: "Yep! We'll have a his/hers signature cocktail during cocktail hour. After that, we'll have an open beer, wine, and liquor bar. Feel free to go crazy.",
    },
    {
        id: 'q14',
        question: 'Registry',
        answer: 'Coming soon to a theater near you.',
        lastUpdated: new Date(2024, 6, 26),
    },
    {
        id: 'q15',
        question: 'Will there be a welcome party?',
        answer: "Yep! We're working on the detail where it'll be, but we anticipate it being Friday night from 7pm - midnight.",
    },
    {
        id: 'q16',
        question: 'Any additional questions?',
        answer: 'Please feel free to call or message us.',
    },
] as const;

export default function FAQ(): JSX.Element {
    const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

    const handlePanelChange = (panelId: string) => {
        setExpandedPanels((prevPanels) => {
            if (prevPanels.includes(panelId)) {
                return prevPanels.filter((id) => id !== panelId);
            } else {
                return [...prevPanels, panelId];
            }
        });
    };

    return (
        <PageContainer>
            <Box margin="0 auto" width={{ xs: '100%', sm: '100%', md: '80%', lg: '80%' }}>
                {FAQ_ITEMS.map((item, index) => (
                    <QuestionAnswerBox
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        expanded={expandedPanels.includes(item.id)}
                        handleChange={() => handlePanelChange(item.id)}
                        lastUpdated={item.lastUpdated}
                    />
                ))}
            </Box>
        </PageContainer>
    );
}
