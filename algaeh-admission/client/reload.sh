#!/usr/bin/osascript

on run argv
	set refreshOnly to false
	if (item 1 of argv) = "--refresh-only" or (item 1 of argv) = "-r" then
		set refreshOnly to true
		set argv to rest of argv
	end if
	set theUrl to item 1 of argv
	tell application "Google Chrome"
		if (count every window) = 0 then
			make new window
		end if
		set found to false
		set theTabIndex to -1
		repeat with theWindow in every window
			set theTabIndex to 0
			repeat with theTab in every tab of theWindow
				set theTabIndex to theTabIndex + 1
				if theTab's URL = theUrl then
					set found to true
					exit repeat
				end if
			end repeat
			if found then
				exit repeat
			end if
		end repeat
		if found then
			if not refreshOnly then
				activate
			end if
			tell theTab to reload
			set theWindow's active tab index to theTabIndex
			set index of theWindow to 1
		else if not refreshOnly then
			activate
			tell window 1 to make new tab with properties {URL:theUrl}
		end if
	end tell
end run