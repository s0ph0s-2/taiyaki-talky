# Tayaki-Talky

A drop-dead simple reimplementation of the core functionality of https://github.com/curtgrimes/webcaptioner.

## Usage

1. Clone this repo
2. Download a copy of [Redbean with at least Lua support](https://justine.lol/redbean) and put it in the repository folder
3. Ensure that your copy of Redbean is named `redbean.com`
4. Do you want to serve minified source files?
   - If yes, run `npm ci && npm run build`
   - If no, run `./make-redbean.sh`
5. `chmod +x redbean.com` (if on \*nix)
6. Run `redbean.com`. Your browser will open to the application.

## Privacy

This application collects no data from you. However, because it uses the Web Speech API to perform transcription, your audio may be sent to a 3rd party server for transcription. This is known to be true for Google Chrome.

## Why does this exist?

[A friend of mine](https://twitch.tv/XorenMoonbeam) was using WebCaptioner to produce captions for his Twitch stream. When the original author of WebCaptioner shut it down, that functionality broke. I got WebCaptioner running again, but it's based on outdated JavaScript dependencies, and it sends 22 MB of stuff to the client. I suspected the task could be done more simply without most of that, and I think I have succeeded.

At last count, this transfers 9.5 KB to the client, loads in 52 ms, and gets a perfect Lighthouse score.

## Why is it called that?

When I wrote this, I had [Tayaki](https://en.wikipedia.org/wiki/Taiyaki) on the brain (I was hungry for dessert). At least in my dialect of English, the name "Tayaki-Talky" has a pleasant repetitiveness to it. Also, because it is meant to be served by the [Redbean](https://justine.lol/redbean) web server, it's extra fitting! Also, Tayaki-Talky is a much nicer name than "Paste."

## Why are you bolting some weird web server onto this?

I highly recommend reading about Redbean, it's a fascinating project. In this particular case, using it enables me to give the executable to anyone who already knows how to use their computer with three instructions:

1. Download this
2. Run it
3. Click "Start Captioning"

And since it's a small file, it's very easy to keep it around and keep it working. I want this project to be very low maintenance.

## Hey, there's still 48 MB of `node_modules` in here!

All of that is optional! You only need to touch Node if you want to minify the code. It's already quite small, so that's not necessary, and you can just run `./make-redbean.sh` to zip it all up and get on with your life.

## What support is offered?

Approximately none. If you open a GitHub issue with a polite feature request or an easy-to-reproduce bug report, I'll consider implementing/fixing it. Unfortunately, I don't have the capacity to offer anything better than that.

## License

MIT, just like WebCaptioner.
