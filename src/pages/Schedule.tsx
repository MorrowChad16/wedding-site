import PageContainer from '../components/page-container';
import ScheduleIcon from '../components/schedule-icon';
import { CircularProgress, Grid } from '@mui/material';
import { useStore } from '../api/use-store';
import { getWeddingGuestsByEmail } from '../api/use-guests';
import { getVisibleScheduleItems } from '../api/use-schedule';

export default function Schedule() {
    const { storeEmail } = useStore();
    const { isLoading: guestsLoading, guests } = getWeddingGuestsByEmail(storeEmail);
    const { isLoading: scheduleLoading, scheduleItems } = getVisibleScheduleItems();

    const isLoading = guestsLoading || scheduleLoading;

    return (
        <PageContainer>
            <Grid container spacing={2} justifyContent="center">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    scheduleItems
                        ?.filter(
                            (item) =>
                                item.isPrivate === false ||
                                item.isPrivate === guests?.some((guest: any) => guest.isBridalParty)
                        )
                        .map((item) => (
                            <ScheduleIcon
                                key={item.uid}
                                uid={item.uid}
                                startTime={item.startTime}
                                endTime={item.endTime}
                                title={item.title}
                                description={item.description}
                                location={item.location}
                                locationName={item.locationName}
                                iconAsset={item.iconAsset}
                                formality={item.formality}
                            />
                        )) || []
                )}
            </Grid>
        </PageContainer>
    );
}
