````
+-++-++-++-+
|e||m||e||m|
+-++-++-++-+
````

Development Status
------------------
Currently seeking feedback from the community.

Use Case
--------
Another JavaScript library or developer's code blows content out the DOM accidently leaving event handlers behind with references to the removed elements causing memory leaks. 
You are running mulitple versions of the same JavaScript library, possibly to support legacy code, and memory is leaking because each version has references to some of the same elements. 

Solution
--------
Emem provides the ability to view event handlers from various JavaScript libraries and identifies those attached to orphaned elements.

API
---
This API will likely change. I am currently seeking feedback from the community as to whether emem is even useful and if useful what features would be most beneficial.

### emem.conf()
Sets the libraries to be examined. The alias names are assumed to be attached to window. Eventually a string representation of the library location or a direct reference to the library will be accepted.

```javascript
emem.conf({
	libs : {
		jQuery: { versions: ['jq16', 'jq17']}                         
	}
});
```

###emem.garbage()
Returns references to event handlers for all orphaned elements. Filtering by library and version, and a verbose mode could be added in the future if a need is expressed by the community.

###emem.release()
Destroys event handlers attached to orphaned elements. A more granular destruction could be added by passing in a reference to the event handler to be deleted. For instance, one could examine the results from emem.garabage() and cherry pick objects to be deleted.