# Privacy policy

This software handles [^1] user data.

This software is a free software distributed under MIT License. Its source code is available at https://github.com/WishfulShopping/WebExtension/ to backup the accuracy of this privacy policy.

## This software collects user data

With a button, the user can trigger the feature "add this page to a wishlist" in order to scrape the content of the current webpage visited and store it locally inside his browser [^2].

If the user creates additional wishlists this software will store them locally inside his browser [^3]

## This software uses user data

The user can access and manage the scraped content within the wishlist option page. It is the purpose of this software to allow the user to compare all scraped the content and keep it for future reference.

## This software has a login functionality

If the user specify a CouchDB synchronisation service credentials, this software will store the credentials locally inside his browser [^3]

## This software shares user data

If the user enable wishlist synchronisation this software will transmit and receive the scraped content to the specified CouchDB synchronisation service [^4].

[^1]: https://developer.chrome.com/docs/webstore/program-policies/user-data-faq#ques_2
[^2]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#security
[^3]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
[^4]: https://pouchdb.com/api.html#options
