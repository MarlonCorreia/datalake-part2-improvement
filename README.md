# Performance improvement for part2 of datalake challenge

Basically i was fascinated with this part of the challenge, and spent some time a few weeks ago trying to find a way to improve it's performance. The problem of this case was simple: You have a massive file with 70k json objects with this structure `{"productId": "{number}", "image": "{img_url"}`, but `{number}` and `{img_url}` was repeated several times in the file. This is what we have to do:

- Iterate the whole file
- Check if the the `{img_url}` returns 2XX
- Return a new json object for with productId with this structure: `{"productId": "{number}", "images": "[{list of unique and 2XX images for this productId, with the max value of 3}]"}`

While having in mind that performance (time/cpu usage) is very important. So avoid making more than one request for wich `{img_url}`

## Solution

For this version of the solution, i decided to use NodeJs instead of Python. After a bit of testing with requests in both, nodeJs with axios had a pretty big win (in average, 70k requests with NodeJs/Axios took ~17s, with python it took ~2min). So here astep by step guide of what the script do:

- Use fs and readLine to read the file linebyLine
- Created a map, with {productId} -> [{image}, {image}... all images for this id]
- Iterate this map, with this process for the images:
  - Befire iterating the images, creale a new list thar'll receive the images with status 200 for this product (max of 3)
  - Is this image already in my new list? If yes, pass
  - Is this image already cached? If yes, append to new list. If not, make a request and if it returns 200, save it in the cache.
  - When we have 3 images on the new list, or we finished the images for this productId, print the object with the new structure: `{"productId": "{number}", "images": new List}`

With this solution, I could get an avarege time of `16s`. My first solution using python and Redis my avarege time was `80s`. There's still a lot of room to gain in termos of CPU usage, but

## Setup

For runnig this solution, you'll need to install the dependecies

```bash
$ npm install
```

After that, you still need to run the sevice that the script needs to make requests for which `{img_url}`

```bash
$ node server.js
```

## Usage

Finally, you can run the script with the command below, this'll run the script and at the end will show the time/cpu usage

```bash
$ time node .
```
