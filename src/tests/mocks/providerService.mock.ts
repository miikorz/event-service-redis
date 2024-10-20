const mockSingleEventData = `
    <eventList>
    <output>
        <base_event base_event_id="1" sell_mode="online" title="Event 1">
        <event event_id="100" event_start_date="2023-10-12T20:00:00" event_end_date="2023-10-12T22:00:00">
            <zone zone_id="1" price="50" />
        </event>
        </base_event>
    </output>
    </eventList>
`;

const mockSingleEventParsedData = {
    eventList: {
        output: {
            base_event: {
                base_event_id: "1",
                sell_mode: "online",
                title: "Event 1",
                event: {
                    event_id: "100",
                    event_start_date: "2023-10-12T20:00:00",
                    event_end_date: "2023-10-12T22:00:00",
                    zone: { zone_id: "1", price: "50" }
                }
            }
        }
    }
};

const mockEventsData = `
    <eventList>
    <output>
        <base_event base_event_id="1" sell_mode="online" title="Event 1">
        <event event_id="100" event_start_date="2023-10-12T20:00:00" event_end_date="2023-10-12T22:00:00">
            <zone zone_id="1" price="50" />
        </event>
        </base_event>
        <base_event base_event_id="2" sell_mode="offline" title="Event 2">
        <event event_id="101" event_start_date="2023-10-13T20:00:00" event_end_date="2023-10-13T22:00:00">
            <zone zone_id="2" price="100" />
        </event>
        </base_event>
    </output>
    </eventList>
`;

const mockParsedEventsData = {
    eventList: {
        output: {
            base_event: [
            {
                base_event_id: "1",
                sell_mode: "online",
                title: "Event 1",
                event: {
                event_id: "100",
                event_start_date: "2023-10-12T20:00:00",
                event_end_date: "2023-10-12T22:00:00",
                zone: { zone_id: "1", price: "50" }
                }
            },
            {
                base_event_id: "2",
                sell_mode: "offline",
                title: "Event 2",
                event: {
                event_id: "101",
                event_start_date: "2023-10-13T20:00:00",
                event_end_date: "2023-10-13T22:00:00",
                zone: { zone_id: "2", price: "100" }
                }
            }
            ]
        }
    }
};
export { mockSingleEventData, mockSingleEventParsedData, mockParsedEventsData, mockEventsData };