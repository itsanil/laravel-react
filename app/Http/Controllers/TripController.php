<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Redirect;
use Auth;
use App\Services\WebScraper;

class TripController extends Controller
{
    protected $scraper;

    public function __construct(WebScraper $scraper)
    {
        $this->scraper = $scraper;
    }

    public function scrape(Request $request)
    {
        $titles = [$request->search];
        $search = str_replace(' ', '%20', $request->search);
        $url = 'https://www.zomato.com/webroutes/location/search?q='.($search).'&lat=27.1800000000000000&lon=78.0200000000000000';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers = [
            // 'Accept: */*',
            // 'Accept-Encoding: gzip, deflate, br, zstd',
            // 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8',
            // 'Connection: keep-alive',
            // 'Content-Type: application/json',
            'Host: www.zomato.com',
            // 'Referer: https://www.zomato.com/agra',
            // 'sec-ch-ua: "Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            // 'sec-ch-ua-mobile: ?0',
            // 'sec-ch-ua-platform: "Windows"',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            // 'x-zomato-csrft: 068161f5d609ccf54258bd71e5b0d8fd',
        ];

        // Add headers to the request
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $res = json_decode(curl_exec($ch), true);
        if (isset($res['locationSuggestions'])) {
            $titles = array_column($res['locationSuggestions'], 'entity_subtitle');
        }
        return response()->json($titles,200);
    }
    
    public function index()
    {
        $trips = Trip::all();
        return Inertia::render('Trips/Index', ['trips' => $trips]);
    }

    public function create()
    {
        $mode = 'create';
        return Inertia::render('Trips/TripForm',compact('mode'));
    }

    public function store(Request $request)
    {
        // echo "<pre>"; print_r($request->all()); echo "</pre>"; die('anil');
        $request->validate([
            'vehicle_type' => 'required|string',
            'total_no_of_slots' => 'required|integer',
            // 'total_no_of_slots_available' => 'required|integer',
            // 'slots_used_by_creater' => 'required|integer',
            'pickup_point' => 'required|string',
            'destination' => 'required|string',
            'start_time' => 'required',
        ]);
        $data = $request->all();
        $data['user_id'] = Auth::user()->id;


        Trip::create($data);

        return Redirect::route('trip.index')->with('success', 'Trip created successfully');
    }

    public function show(Trip $trip)
    {
        return Inertia::render('Trips/Show', ['trip' => $trip]);
    }

    public function edit(Trip $trip)
    {
        $mode = 'edit';
        return Inertia::render('Trips/TripForm', ['trip' => $trip,'mode'=>$mode]);
    }

    public function update(Request $request, Trip $trip)
    {
        $request->validate([
            'vehicle_type' => 'required|string',
            'total_no_of_slots' => 'required|integer',
            // 'total_no_of_slots_available' => 'required|integer',
            // 'slots_used_by_creater' => 'required|integer',
            'pickup_point' => 'required|string',
            'destination' => 'required|string',
            'start_time' => 'required',
            // 'start_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $trip->update($request->all());

        return Redirect::route('trip.index')->with('success', 'Trip updated successfully');
    }

    public function destroy(Trip $trip)
    {
        $trip->delete();

        return Redirect::route('trip.index');
    }
}

