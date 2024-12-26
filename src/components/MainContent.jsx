import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import PrayerCards from './PrayerCards';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar-dz";

moment.locale("ar-dz");
const MainContent = () => {
    const prayersArray = [
        { key: "Fajr", prayerName: "الفجر" },
        { key: "Dhuhr", prayerName: "الظهر" },
        { key: "Asr", prayerName: "العصر" },
        { key: "Maghrib", prayerName: "المغرب" },
        { key: "Isha", prayerName: "العشاء" }
    ]
    const cities = [
        { displayName: " المسيلة", apiName: "M'Sila" },
        { displayName: " وهران", apiName: "Oran" },
        { displayName: " باتنة", apiName: "Batna" },
        { displayName: " جيجل", apiName: "Jijel" }
    ];
    //states
    const [selectedCity, setSelectedCity] = useState({
        apiName: "M'Sila",
        displayName:" المسيلة"
    });
    const [timings, setTimings] = useState({
            "Fajr": "05:02",
            "Dhuhr": "11:40",
            "Asr": "14:35",
            "Maghrib": "16:55",
            "Isha": "18:25",
    });
    const [today, setToday] = useState("");
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState("");
    //api reqeust to get data
    async function fetchData() {
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?country=DZ&city=${selectedCity.apiName}`
        );
        setTimings(response.data.data.timings);
    }
    //for every re-render setTimings
    useEffect(() => {
        fetchData();
    }, [selectedCity])

    //to show the next pray
    useEffect(() => {
        let intervale = setInterval(() => {
            countDownTimer();
        }, 1000)
        const t = moment().format("MMM Do YYYY |hh:mm");
        setToday(t);
        return () => {
            clearInterval(intervale);
        }
    }, [timings])
    const countDownTimer = () => {
        const momentNow = moment();
        let  prayerIndex = 2 ;
        if (momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))){
            prayerIndex = 1;
        } else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
            prayerIndex = 2;
        } else if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
            prayerIndex = 3;
        } else if (momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }
        setNextPrayerIndex(prayerIndex);
        //
        const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);
			const totalDiffernce = midnightDiff + fajrToMidnightDiff;
			remainingTime = totalDiffernce;
		}
		const durationRemainingTime = moment.duration(remainingTime);
		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
	};
    //change name of every city from select input
    const handleSelect = (e) => {
        const cityObject = cities.find((city) => {
            return city.apiName == e.target.value;
        })
        setSelectedCity(cityObject);
    }
    return (
        <>
            <Grid container>
                <Grid sx={6}>
                    <div style={{marginLeft:'350px'}}>
                        <h1>{today}</h1>
                        <h2>{selectedCity.displayName}</h2>
                    </div>
                </Grid>
                <Grid sx={6}>
                    <div>
                        <h1>متبقي حتى صلاة {prayersArray[nextPrayerIndex].prayerName}</h1>
                        <h2>{remainingTime}</h2>
                    </div>
                </Grid>
            </Grid>
            <Divider variant="Middle" style={{ borderColor: 'white', opacity: '0.1' }} />
            <br />
            <Stack direction='row' spacing={1} justifyContent={'space-around'}>
                <PrayerCards name="الفجر" time={timings.Fajr} image={"./public/fajr2.jpg"} />
                <PrayerCards name="الظهر" time={timings.Dhuhr} image={"./public/dhuhr2.jpg"} />
                <PrayerCards name="العصر" time={timings.Asr}  image={"./public/asr.jpg"}/>
                <PrayerCards name="المغرب" time={timings.Maghrib}  image={"./public/maghrib.jpg"}/>
                <PrayerCards name="العشاء" time={timings.Isha}  image={"./public/isha2.jpg"}/>
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} style={{marginTop:'20px'}}>
            <FormControl style={{width:'20%'}}>
        <InputLabel id="demo-simple-select-label" style={{color:'white',fontSize:'20px'}}>المدينة</InputLabel>
        <Select 
        onChange={handleSelect}
        style={{color:'white'}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="المدينة"
        >
        {cities.map((city) => {
            return (
                <MenuItem key={1} value={city.apiName}>{city.displayName}</MenuItem>
            ) 
        })}
        {/* <MenuItem value={"Makkah al Mukarramah"}>مكة المكرمة</MenuItem>
        <MenuItem value={"Riyadh"}>الرياض</MenuItem>
        <MenuItem value={"Dammam"}>الدمام</MenuItem> */}
        </Select>
        </FormControl>
        </Stack>
        </>
    )
}
export default MainContent;