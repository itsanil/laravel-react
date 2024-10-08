<?php

namespace App\Services;

use Goutte\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WebScraper
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
    }

    public function scrape($url)
    {

        $response = Http::get($url);
        $address = [];
        // Check if the request was successful
        if ($response->successful()) {
            // Get the file contents
            $content = $response->body();
            $jsonString = substr($content, 4); // Remove the unwanted prefix
            $jsonString = str_replace("\u003cb\u003e", "", $jsonString); // Remove the unwanted prefix
            $jsonString = str_replace("\u003c\/b\u003e", "", $jsonString); // Remove the unwanted prefix
            $jsonString = str_replace("\u003csc\u003e", "", $jsonString); // Remove the unwanted prefix
            $jsonString = str_replace("\u003c\/sc\u003e", "", $jsonString); // Remove the unwanted prefix
            $jsonString = str_replace("\u003cse\u003e", "", $jsonString); // Remove the unwanted prefix
            // $jsonString = str_replace("\u003c\u003e", "", $jsonString); // Remove the unwanted prefix
            $jsonString = str_replace("\u003c\/se\u003e", "", $jsonString); // Remove the unwanted prefix
            // $jsonString = str_replace("\u003e", "", $jsonString); // Remove the unwanted prefix
            // $jsonString = str_replace('/se', "", $jsonString); // Remove the unwanted prefix

            // $jsonString = str_replace('\/se', "", $jsonString); // Remove the unwanted prefix
            $data = explode('"',$jsonString);
            foreach ($data as $address_value) {
                if(is_string($address_value) && strpos($address_value, ' ') !== false){
                    $address[] = $address_value;
                }
            }
            return array_unique($address);
            // echo "<pre>"; print_r(array_unique($address)); echo "</pre>"; die('anil');
            // Return the content as a response or process it as needed
            return response(array_unique($address), 200, [
            // return response($content, 200, [
                'Content-Type' => 'text/plain',
            ]);
        }
        $crawler = $this->client->request('GET', $url);
        return $crawler;
        // echo "<pre>"; print_r($crawler); echo "</pre>"; die('anil');
        // Example: Extracting titles from a blog page
        $titles = $crawler->filter('div.fHv_i')->each(function ($node) {
            return $node->text();
        });

        $desc = $crawler->filter('p.o58kM')->each(function ($node) {
            return $node->text();
        });

        return [$titles,$desc];
    }
}
