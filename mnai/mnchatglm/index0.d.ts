declare const enum NSStringEncoding /** ASCII encoding contains, 7-bit of information stored in 8 bits. */ {
    ASCIIStringEncoding = 1,
    ISO2022JP = 21,
    /** 8-bit ISO/IEC 8859-1, also knows as Latin1 encoding. */
    ISOLatin1 = 5,
    /** 8-bit ISO/IEC 8859-2, also knows as Latin2 encoding. */
    ISOLatin2 = 9,
    JapaneseEUC = 3,
    MacOSRoman = 30,
    NEXTSTEP = 2,
    NonLossyASCII = 7,
    ShiftJIS = 8,
    Symbol = 6,
    Unicode = 10,
    /** 16 bit-based variable length encoding, blocks are interpreted as big endian. */
    UTF16BigEndian = 2415919360,
    /** 16 bit-based variable length encoding, blocks are interpreted as litle endian. */
    UTF16LittleEndian = 2483028224,
    /** 32-bit unicode encoding. */
    UTF32 = 2348810496,
    /** 32 bit encoding, blocks are interpreted as big endian. */
    UTF32BigEndian = 2550137088,
    /** 32 bit encoding, blocks are interpreted as little endian. */
    UTF32LittleEndian = 2617245952,
    /** 8-bit based variable-length character encoding for Unicode. */
    UTF8 = 4,
    WindowsCP1250 = 15,
    WindowsCP1251 = 11,
    WindowsCP1252 = 12,
    WindowsCP1253 = 13,
    WindowsCP1254 = 14
}
declare const enum NSDataReadingOptions {
    Coordinated = 4,
    /** Use the kernel's virtual memory map to load the file, if possible. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
    Mapped = 1,
    /** Force NSData to try to use the kernel's mapping support to load the file. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
    MappedAlways = 8,
    /** Notify the kernel that it should not try to cache the contents of this file in its buffer cache. */
    Uncached = 2
}
declare const enum NSDataWritingOptions {
    Atomic = 1,
    FileProtectionComplete = 536870912,
    FileProtectionCompleteUnlessOpen = 805306368,
    FileProtectionCompleteUntilFirstUserAuthentication = 1073741824,
    FileProtectionMask = 4026531840,
    FileProtectionNone = 268435456,
    WithoutOverwriting = 2
}
declare const enum NSDataSearchOptions {
    /** Limits the search to the start (or end if SearchBackwards is specified) */
    SearchAnchored = 2,
    /** Starts search from the end, instead of the start. */
    SearchBackwards = 1
}
declare global {
   class NSData {
    /**
       * @param string NSString*
       */
    static dataWithStringEncoding(string: string, encoding: NSStringEncoding): NSData;
      /**
       * @param bytes const void*
       * @param length NSUInteger
       */
    static dataWithBytesLength(bytes: any, length: number): NSData;
      /**
       * @param bytes void*
       * @param length NSUInteger
       */
    static dataWithBytesNoCopyLength(bytes: any, length: number): NSData;
      /**
       * @param bytes void*
       * @param length NSUInteger
       */
    static dataWithBytesNoCopyLengthFreeWhenDone(bytes: any, length: number, b: boolean): NSData;
      /**
       * @param path NSString*
       * @param errorPtr NSError**
       */
    static dataWithContentsOfFileOptionsError(path: string, readOptionsMask: NSDataReadingOptions, errorPtr: NSError): NSData;
      /**
       * @param url NSURL*
       * @param errorPtr NSError**
       */
    static dataWithContentsOfURLOptionsError(url: NSURL, readOptionsMask: NSDataReadingOptions, errorPtr: NSError): NSData;
      /**
       * @param path NSString*
       */
    static dataWithContentsOfFile(path: string): NSData;
      /**
       * @param url NSURL*
       */
    static dataWithContentsOfURL(url: NSURL): NSData;
      /**
       * @param data NSData*
       */
    static dataWithData(data: NSData): NSData;
      /**
       * @param path NSString*
       */
    static dataWithContentsOfMappedFile(path: string): NSData;
    constructor();
    /**
     * @returns NSUInteger
     */
    length(): number;
    /**
     * @returns const void*
     */
    bytes(): number;
    /**
     * @returns NSString*
     */
    description(): string;
    /**
     * @param buffer void*
     * @param length NSUInteger
     */
    getBytesLength(buffer: any, length: number): void;
    /**
     * @param buffer void*
     */
    getBytesRange(buffer: void, range: NSRange): void;
    /**
     * @param other NSData*
     */
    isEqualToData(other: NSData): boolean;
    /**
     * @returns NSData*
     */
    subdataWithRange(range: NSRange): NSData;
    /**
     * @param path NSString*
     */
    writeToFileAtomically(path: string, useAuxiliaryFile: boolean): boolean;
    /**
     * @param url NSURL*
     */
    writeToURLAtomically(url: NSURL, atomically: boolean): boolean;
    /**
     * @param path NSString*
     * @param errorPtr NSError**
     */
    writeToFileOptionsError(path: string, writeOptionsMask: NSDataWritingOptions, errorPtr: NSError): boolean;
    /**
     * @param url NSURL*
     * @param errorPtr NSError**
     */
    writeToURLOptionsError(url: NSURL, writeOptionsMask: NSDataWritingOptions, errorPtr: NSError): boolean;
    /**
     * @param dataToFind NSData*
     */
    rangeOfDataOptionsRange(dataToFind: NSData, mask: NSDataSearchOptions, searchRange: NSRange): NSRange;
    /**
     * @param block void (^)(const void*bytes,NSRange byteRange,BOOL*stop)
     */
    enumerateByteRangesUsingBlock(block: any): void;
    /**
     * @param buffer void*
     */
    getBytes(buffer: any): void;
    /**
     * @returns NSString*
     */
    base64Encoding(): string;
    }
    class NSMutableData {
      static new(): NSMutableData;
      constructor();
      appendData(data:NSData);
    }
}

declare global {
    const NSFileManager: {
        defaultManager(): NSFileManager;
    };
}
declare type NSFileManager = {
    contentsOfDirectoryAtPath(path: string): string[];
    subpathsOfDirectoryAtPath(path: string): string[];
    fileExistsAtPath(path: string): boolean;
    isDirectoryAtPath(path: string): boolean;
    moveItemAtPathToPath(path: string, toPath: string): boolean;
    copyItemAtPathToPath(path: string, toPath: string): boolean;
    createDirectoryAtPathAttributes(path: string, attributes: NSDictionary): boolean;
};

declare const enum NSJSONWritingOptions {
    PrettyPrinted = 0,
    SortedKeys = 1,
    FragmentsAllowed = 2,
    WithoutEscapingSlashes = 3
}
declare const enum NSJSONReadingOptions {
    MutableContainers = 1,
    MutableLeaves = 2,
    FragmentsAllowed = 4,
    JSON5Allowed = 8,
    TopLevelDictionaryAssumed = 16
}
declare global {
    const NSJSONSerialization: {
        isValidJSONObject(obj: any): boolean;
        JSONObjectWithDataOptions(data: NSData, options: NSJSONReadingOptions): any;
        dataWithJSONObjectOptions(obj: any, options: NSJSONWritingOptions): NSData;
    };
}
declare type NSJSONSerialization = {};

declare global {
    const NSLocale: {
        autoupdatingCurrentLocale(): NSLocale;
        currentLocale(): NSLocale;
        systemLocale(): NSLocale;
        /**
         * @param ident NSString*
         */
        localeWithLocaleIdentifier(ident: string): NSLocale;
        /**
         * @returns NSArray*
         */
        availableLocaleIdentifiers(): string[];
        /**
         * @returns NSArray*
         */
        ISOLanguageCodes(): string[];
        /**
         * @returns NSArray*
         */
        ISOCountryCodes(): string[];
        /**
         * @returns NSArray*
         */
        ISOCurrencyCodes(): string[];
        /**
         * @returns NSArray*
         */
        commonISOCurrencyCodes(): string[];
        /**
         * @returns NSArray*
         */
        preferredLanguages(): string[];
        /**
         * @returns NSDictionary*
         * @param string NSString*
         */
        componentsFromLocaleIdentifier(string: string): DictObj;
        /**
         * @returns NSString*
         * @param dict NSDictionary*
         */
        localeIdentifierFromComponents(dict: DictObj): string;
        /**
         * @returns NSString*
         * @param string NSString*
         */
        canonicalLocaleIdentifierFromString(string: string): string;
        /**
         * @returns NSString*
         * @param string NSString*
         */
        canonicalLanguageIdentifierFromString(string: string): string;
        /**
         * @returns NSString*
         * @param lcid uint32_t
         */
        localeIdentifierFromWindowsLocaleCode(lcid: number): string;
        /**
         * @returns uint32_t
         * @param localeIdentifier NSString*
         */
        windowsLocaleCodeFromLocaleIdentifier(localeIdentifier: string): number;
        /**
         * @param isoLangCode NSString*
         */
        characterDirectionForLanguage(isoLangCode: string): NSLocaleLanguageDirection;
        /**
         * @param isoLangCode NSString*
         */
        lineDirectionForLanguage(isoLangCode: string): NSLocaleLanguageDirection;
    };
}
declare type NSLocale = {
    objectForKey(key: any): any;
    /**
     * @returns NSString*
     */
    displayNameForKeyValue(key: any, value: any): string;
    /**
     * @returns NSString*
     */
    localeIdentifier(): string;
};
declare const enum NSLocaleLanguageDirection {
    BottomToTop = 4,
    LeftToRight = 1,
    RightToLeft = 2,
    TopToBottom = 3,
    Unknown = 0
}

declare global {
    const NSNotification: {
        /**
         * @param name NSString*
         */
        notificationWithNameObject(name: string, anObject: any): NSNotification;
        /**
         * @param name NSString*
         * @param aUserInfo NSDictionary*
         */
        notificationWithNameObjectUserInfo(name: string, anObject: any, aUserInfo: DictObj): NSNotification;
    };
    const NSNotificationCenter: {
        defaultCenter(): NSNotificationCenter;
    };
}
declare type NSNotification = {
    readonly name?: string;
    readonly object: any;
    readonly userInfo?: DictObj;
    /**
     * @param name NSString*
     * @param userInfo NSDictionary*
     */
    initWithNameObjectUserInfo(name: string, object: any, userInfo: DictObj): NSNotification;
};
declare type NSNotificationCenter = {
    init(): NSNotificationCenter;
    /**
     * @param selector the function name of {@link EventHandler} in {@link InstMember}
     * @param name event name
     */
    addObserverSelectorName(observer: any, selector: string, name: string): void;
    /**
     * @param notification NSNotification*
     */
    postNotification(notification: NSNotification): void;
    /**
     * @param name NSString*
     */
    postNotificationNameObject(name: string, anObject: any): void;
    /**
     * @param name NSString*
     * @param aUserInfo NSDictionary*
     */
    postNotificationNameObjectUserInfo(name: string, anObject: any, aUserInfo: DictObj): void;
    removeObserver(observer: any): void;
    /**
     * @param name NSString*
     */
    removeObserverName(observer: any, name: string): void;
};

declare const enum NSURLBookmarkResolutionOptions {
    WithoutMounting = 512,
    WithoutUI = 256,
    WithSecurityScope = 1024
}
declare const enum NSURLBookmarkFileCreationOptions {
    MinimalBookmark = 512,
    PreferFileIDResolution = 256,
    SecurityScopeAllowOnlyReadAccess = 4096,
    SuitableForBookmarkFile = 1024,
    WithSecurityScope = 2048
}
declare const enum NSURLBookmarkCreationOptions {
    MinimalBookmark = 512,
    PreferFileIDResolution = 256,
    SecurityScopeAllowOnlyReadAccess = 4096,
    SuitableForBookmarkFile = 1024,
    WithSecurityScope = 2048
}
declare type NSURL = {
    percentEncodedFragment?: string;
    percentEncodedPath?: string;
    query?: string;
    percentEncodedPassword?: string;
    path?: string;
    host?: string;
    password?: string;
    scheme?: string;
    percentEncodedHost?: string;
    percentEncodedUser?: string;
    percentEncodedQuery?: string;
    user?: string;
    fragment?: string;
    port?: number | boolean;
    /**
     * @returns NSString*
     */
    absoluteString(): string;
    /**
     * @returns NSString*
     */
    relativeString(): string;
    /**
     * @returns NSURL*
     */
    baseURL(): NSURL;
    /**
     * @returns NSURL*
     */
    absoluteURL(): NSURL;
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    resourceSpecifier(): string;
    /**
     * @returns NSString*
     */
    /**
     * @returns NSNumber*
     */
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    parameterString(): string;
    /**
     * @returns NSString*
     */
    /**
     * @returns NSString*
     */
    relativePath(): string;
    /**
     * @param buffer char*
     */
    getFileSystemRepresentationMaxLength(buffer: string, maxBufferLength: number): boolean;
    /**
     * @returns const char*
     */
    fileSystemRepresentation(): string;
    isFileURL(): boolean;
    /**
     * @returns NSURL*
     */
    standardizedURL(): NSURL;
    /**
     * @param error NSError**
     */
    checkResourceIsReachableAndReturnError(error: NSError): boolean;
    isFileReferenceURL(): boolean;
    /**
     * @returns NSURL*
     */
    fileReferenceURL(): NSURL;
    /**
     * @returns NSURL*
     */
    filePathURL(): NSURL;
    /**
     * @param value out id*
     * @param key NSString*
     * @param error out NSError**
     */
    getResourceValueForKeyError(value: any, key: string, error: NSError): boolean;
    /**
     * @returns NSDictionary*
     * @param keys NSArray*
     * @param error NSError**
     */
    resourceValuesForKeysError(keys: any[], error: NSError): DictObj;
    /**
     * @param key NSString*
     * @param error NSError**
     */
    setResourceValueForKeyError(value: any, key: string, error: NSError): boolean;
    /**
     * @param keyedValues NSDictionary*
     * @param error NSError**
     */
    setResourceValuesError(keyedValues: DictObj, error: NSError): boolean;
    /**
     * @param key NSString*
     */
    removeCachedResourceValueForKey(key: string): void;
    removeAllCachedResourceValues(): void;
    /**
     * @param key NSString*
     */
    setTemporaryResourceValueForKey(value: any, key: string): void;
    /**
     * @returns NSData*
     * @param keys NSArray*
     * @param relativeURL NSURL*
     * @param error NSError**
     */
    bookmarkDataWithOptionsIncludingResourceValuesForKeysRelativeToURLError(options: NSURLBookmarkCreationOptions, keys: any[], relativeURL: NSURL, error: NSError): NSData;
    startAccessingSecurityScopedResource(): boolean;
    stopAccessingSecurityScopedResource(): void;
    /**
     * @returns NSURL*
     */
    URL(): NSURL;
    /**
     * @returns NSURL*
     * @param baseURL NSURL*
     */
    URLRelativeToURL(baseURL: NSURL): NSURL;
    /**
     * @returns NSString*
     * @param allowedCharacters NSCharacterSet*
     */
    stringByAddingPercentEncodingWithAllowedCharacters(allowedCharacters: NSCharacterSet): string;
    /**
     * @returns NSString*
     */
    stringByRemovingPercentEncoding(): string;
    /**
     * @returns NSString*
     */
    stringByAddingPercentEscapesUsingEncoding(enc: NSStringEncoding): string;
    /**
     * @returns NSString*
     */
    stringByReplacingPercentEscapesUsingEncoding(enc: NSStringEncoding): string;
    /**
     * @returns NSArray*
     */
    pathComponents(): any[];
    /**
     * @returns NSString*
     */
    lastPathComponent(): string;
    /**
     * @returns NSString*
     */
    pathExtension(): string;
    /**
     * @returns NSURL*
     * @param pathComponent NSString*
     */
    URLByAppendingPathComponent(pathComponent: string): NSURL;
    /**
     * @returns NSURL*
     * @param pathComponent NSString*
     */
    URLByAppendingPathComponentIsDirectory(pathComponent: string, isDirectory: boolean): NSURL;
    /**
     * @returns NSURL*
     */
    URLByDeletingLastPathComponent(): NSURL;
    /**
     * @returns NSURL*
     * @param pathExtension NSString*
     */
    URLByAppendingPathExtension(pathExtension: string): NSURL;
    /**
     * @returns NSURL*
     */
    URLByDeletingPathExtension(): NSURL;
    /**
     * @returns NSURL* */
    URLByStandardizingPath(): NSURL;
    /**
     * @returns NSURL*
     */
    URLByResolvingSymlinksInPath(): NSURL;
    readonly previewItemURL?: NSURL;
    readonly previewItemTitle?: string;
};
declare global {
    const NSURL: {
        /**
         * @param path NSString*
         */
        fileURLWithPathIsDirectory(path: string, isDir: boolean): any;
        /**
         * @param path NSString*
         */
        fileURLWithPath(path: string): NSURL;
        /**
         * @param path const char*
         * @param baseURL NSURL*
         */
        fileURLWithFileSystemRepresentationIsDirectoryRelativeToURL(path: string, isDir: boolean, baseURL: NSURL): any;
        /**
         * @param URLString NSString*
         */
        URLWithString(URLString: string): NSURL;
        /**
         * @param URLString NSString*
         * @param baseURL NSURL*
         */
        URLWithStringRelativeToURL(URLString: string, baseURL: NSURL): any;
        /**
         * @param bookmarkData NSData*
         * @param relativeURL NSURL*
         * @param isStale BOOL*
         * @param error NSError**
         */
        URLByResolvingBookmarkDataOptionsRelativeToURLBookmarkDataIsStaleError(bookmarkData: NSData, options: NSURLBookmarkResolutionOptions, relativeURL: NSURL, isStale: boolean, error: NSError): any;
        /**
         * @returns NSDictionary*
         * @param keys NSArray*
         * @param bookmarkData NSData*
         */
        resourceValuesForKeysFromBookmarkData(keys: any[], bookmarkData: NSData): DictObj;
        /**
         * @param bookmarkData NSData*
         * @param bookmarkFileURL NSURL*
         * @param error NSError**
         */
        writeBookmarkDataToURLOptionsError(bookmarkData: NSData, bookmarkFileURL: NSURL, options: NSURLBookmarkFileCreationOptions, error: NSError): boolean;
        /**
         * @returns NSData*
         * @param bookmarkFileURL NSURL*
         * @param error NSError**
         */
        bookmarkDataWithContentsOfURLError(bookmarkFileURL: NSURL, error: NSError): NSData;
        /**
         * @param url NSURL*
         */
        componentsWithURLResolvingAgainstBaseURL(url: NSURL, resolve: boolean): any;
        /**
         * @param URLString NSString*
         */
        componentsWithString(URLString: string): any;
        URLUserAllowedCharacterSet(): any;
        URLPasswordAllowedCharacterSet(): any;
        URLHostAllowedCharacterSet(): any;
        URLPathAllowedCharacterSet(): any;
        URLQueryAllowedCharacterSet(): any;
        URLFragmentAllowedCharacterSet(): any;
        /**
         * @returns NSURL*
         * @param components NSArray*
         */
        fileURLWithPathComponents(components: any[]): NSURL;
    };
}

declare global {
    const NSTimer: {
        /**
         * @returns NSTimer*
         * @param f JSValue*
         */
        scheduledTimerWithTimeInterval(ti: NSTimeInterval, yesOrNo: boolean, f: (timer: NSTimer) => void): NSTimer;
    };
}
declare type NSTimeInterval = number;
declare type NSTimer = {
    fire(): void;
    /**
     * @returns NSDate*
     */
    fireDate(): Date;
    /**
     * @param date NSDate*
     */
    setFireDate(date: Date): void;
    timeInterval(): NSTimeInterval;
    tolerance(): NSTimeInterval;
    setTolerance(tolerance: NSTimeInterval): void;
    invalidate(): void;
    isValid(): boolean;
    userInfo(): any;
};

declare global {
    const NSURLConnection: {
        sendAsynchronousRequestQueueCompletionHandler(request: NSURLRequest, queue: NSOperationQueue, completionHandler: JSValue): NSURLRequest;
        connectionWithRequest(request: NSURLRequest, delegate: any): NSURLConnection;
        connectionWithRequestDelegate(request: NSURLRequest, delegate: any): NSURLConnection;
    };
}
declare type NSURLConnection = {};

declare global {
    const NSURLRequest: {
        requestWithURL(url: NSURL): NSURLRequest;
    };
    const NSMutableURLRequest: {
        requestWithURL(url: NSURL): NSMutableURLRequest;
    };
}
declare type NSURLRequest = {
    URL(): NSURL;
    setURL(url: NSURL): void;
};
declare type NSMutableURLRequest = {
    HTTPMethod(): string;
    setURL(url: NSURL): void;
    setValueForHTTPHeaderField(value: string, field: string): void;
    setAllHTTPHeaderFields(headerFields: NSDictionary): void;
    setHTTPBody(data: NSData): void;
    setHTTPMethod(method: string): void;
    /**
     * double
     * */
    setTimeoutInterval(seconds: number): void;
} & NSURLRequest;
declare type NSURLResponse = {};
declare type NSHTTPURLResponse = {
    statusCode: number;
    allHeaderFields: NSDictionary;
};
declare type NSError = {
    domain: string;
    code: number;
    userInfo: NSDictionary;
    localizedDescription: string;
    localizedFailureReason: string;
    localizedRecoverySuggestion: string;
    localizedRecoveryOptions: NSDictionary;
};

declare global {
    const NSOperationQueue: {
        mainQueue(): NSOperationQueue;
    };
}
declare type NSOperationQueue = {};

declare const enum UIAlertViewStyle {
    /**
     * The default alert view style. The default.
     */
    Default = 0,
    /**
     * Allows the user to enter text, but the text field is obscured.
     */
    SecureTextInput = 1,
    /**
     * Allows the user to enter text.
     */
    PlainTextInput = 2,
    /**
     * Allows the user to enter a login id and a password.
     * @deprecated not support yet
     */
    LoginAndPasswordInput = 3
}
declare global {
    const UIAlertView: {
        showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(title: string, message: string, style: UIAlertViewStyle, cancelButtonTitle: string, otherButtonTitles: string[], tapBlock: (alert: UIAlertView, buttonIndex: number) => any): void;
        makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(title: string, message: string, delegate: any, cancelButtonTitle: string, otherButtonTitles: string[]): void;
    };
}
declare type UIAlertView = {
    textFieldAtIndex(textFieldIndex: number): UITextField;
};

declare global {
    const UIApplication: {
        sharedApplication(): UIApplication;
    };
}
declare type UIApplication = {
    networkActivityIndicatorVisible: boolean;
    idleTimerDisabled: boolean;
    openURL(url: NSURL): boolean;
    canOpenURL(url: NSURL): boolean;
    openURLOptionsCompletionHandler(url: NSURL, options: NSDictionary, completionHandler: JSValue): void;
};

declare const enum UIButtonType {
    system = 0
}
declare const enum NSLineBreakMode {
}
declare type UIEdgeInsets = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
declare const enum UIControlState {
}
declare global {
    class UIButton extends UIControl {
        static buttonWithType(buttonType: UIButtonType): UIButton;
        buttonType: UIButtonType;
        titleEdgeInsets: UIEdgeInsets;
        lineBreakMode: NSLineBreakMode;
        adjustsImageWhenHighlighted: boolean;
        setTitleForState(title: string, state: UIControlState): void;
        setImageForState(image: UIImage, state: UIControlState): void;
        setTitleColorForState(color: UIColor, state: UIControlState): void;
        titleLabel: UILabel;
    }
}

declare global {
    const UIColor: {
        colorWithHexString(rgbHex: string): UIColor;
        blackColor(): UIColor;
        darkGrayColor(): UIColor;
        lightGrayColor(): UIColor;
        whiteColor(): UIColor;
        grayColor(): UIColor;
        redColor(): UIColor;
        greenColor(): UIColor;
        blueColor(): UIColor;
        cyanColor(): UIColor;
        yellowColor(): UIColor;
        magentaColor(): UIColor;
        orangeColor(): UIColor;
        purpleColor(): UIColor;
        brownColor(): UIColor;
        clearColor(): UIColor;
    };
}
declare type UIColor = {
    hexStringValue: string;
    colorWithAlphaComponent(alpha: CGFloat): UIColor;
};

declare class UIControl extends UIView {
    enabled: boolean;
    highlighted: boolean;
    selected: boolean;
    addTargetActionForControlEvents(target: any, action: string, controlEvent: UIControlEvents): void;
    removeTargetActionForControlEvents(target: any, action: string, controlEvent: UIControlEvents): void;
}
declare const enum UIControlEvents {
}

declare class UIEvent {
}

declare global {
    const UIFont: {
        /**
         *  默认 17
         */
        systemFontOfSize(fontSize: number): UIFont;
        boldSystemFontOfSize(fontSize: number): UIFont;
        italicSystemFontOfSize(fontSize: number): UIFont;
    };
}
declare type UIFont = {};

declare const enum UIImageOrientation {
    /** Rotated 180 degrees.  */
    Down = 1,
    /** Flipped about its vertical axis and then rotated 180 degrees.  */
    DownMirrored = 5,
    /** Rotated 90 degrees counterclockwise.  */
    Left = 2,
    /** Flipped about its horizontal axis and then rotated 90 degrees counterclockwise.  */
    LeftMirrored = 6,
    /** Rotated 90 degrees clockwise.  */
    Right = 3,
    /** Flipped about its horizontal axis and then rotated 90 degrees clockwise.  */
    RightMirrored = 7,
    /** Default orientation.  */
    Up = 0,
    /** Flipped about its vertical axis.  */
    UpMirrored = 4
}
declare global {
    const UIImage: {
        /**
         * @returns UIImage*
         * @param name NSString*
         */
        imageNamed(name: string): UIImage;
        /**
         * @returns UIImage*
         * @param path NSString*
         */
        imageWithContentsOfFile(path: string): UIImage;
        /**
         * @returns UIImage*
         * @param data NSData*
         */
        imageWithData(data: NSData): UIImage;
        /**
         * @returns UIImage*
         * @param data NSData*
         */
        imageWithDataScale(data: NSData, scale: CGFloat): UIImage;
        /**
         * @returns UIImage*
         */
        imageWithCGImage(cgImage: any): UIImage;
        /**
         * @returns UIImage*
         */
        imageWithCGImageScaleOrientation(cgImage: any, scale: CGFloat, orientation: UIImageOrientation): UIImage;
    };
}
declare type UIImage = {
    size: CGSize;
    drawAtPoint(point: CGPoint): void;
    drawAtPointBlendModeAlpha(point: CGPoint, blendMode: CGBlendMode, alpha: CGFloat): void;
    drawInRect(rect: CGRect): void;
    drawInRectBlendModeAlpha(rect: CGRect, blendMode: CGBlendMode, alpha: CGFloat): void;
    drawAsPatternInRect(rect: CGRect): void;
    /**
     * @returns UIImage*
     */
    resizableImageWithCapInsets(capInsets: UIEdgeInsets): UIImage;
    /**
     * @returns UIImage*
     */
    imageWithAlignmentRectInsets(alignmentInsets: UIEdgeInsets): UIImage;
    /**
     * @returns UIImage*
     * @param leftCapWidth NSInteger
     * @param topCapHeight NSInteger
     */
    stretchableImageWithLeftCapWidthTopCapHeight(leftCapWidth: number, topCapHeight: number): UIImage;
    /**
     * @returns NSData*
     * @param compressionQuality double
     */
    jpegData(compressionQuality: number): NSData;
    /**
     * @returns NSData*
     */
    pngData(): NSData;
};

declare global {
    const UIPasteboard: {
        /**
         * @returns UIPasteboard*
         */
        generalPasteboard(): UIPasteboard;
        /**
         * @returns UIPasteboard*
         * @param pasteboardName NSString*
         */
        pasteboardWithNameCreate(pasteboardName: string, create: boolean): UIPasteboard;
        /**
         * @returns UIPasteboard*
         */
        pasteboardWithUniqueName(): UIPasteboard;
        /**
         * @param pasteboardName NSString*
         */
        removePasteboardWithName(pasteboardName: string): void;
    };
}
declare type UIPasteboard = {
    persistent: boolean;
    string?: string;
    /**
     *  NSInteger
     */
    readonly numberOfItems: number;
    URL?: NSURL;
    color?: UIColor;
    colors?: any[];
    image?: UIImage;
    /**
     *  NSInteger
     */
    readonly changeCount: number;
    URLs?: NSURL[];
    images?: UIImage[];
    strings?: string[];
    items?: any[];
    readonly name?: string;
    /**
     * @returns NSArray*
     */
    pasteboardTypes(): any[];
    /**
     * @param pasteboardTypes NSArray*
     */
    containsPasteboardTypes(pasteboardTypes: any[]): boolean;
    /**
     * @returns NSData*
     * @param pasteboardType NSString*
     */
    dataForPasteboardType(pasteboardType: string): NSData;
    /**
     * @param pasteboardType NSString*
     */
    valueForPasteboardType(pasteboardType: string): any;
    /**
     * @param pasteboardType NSString*
     */
    setValueForPasteboardType(value: any, pasteboardType: string): void;
    /**
     * @param data NSData*
     * @param pasteboardType NSString*
     */
    setDataForPasteboardType(data: NSData, pasteboardType: string): void;
    /**
     * @returns NSArray*
     * @param itemSet NSIndexSet*
     */
    pasteboardTypesForItemSet(itemSet: NSIndexSet): any[];
    /**
     * @param pasteboardTypes NSArray*
     * @param itemSet NSIndexSet*
     */
    containsPasteboardTypesInItemSet(pasteboardTypes: any[], itemSet: NSIndexSet): boolean;
    /**
     * @returns NSIndexSet*
     * @param pasteboardTypes NSArray*
     */
    itemSetWithPasteboardTypes(pasteboardTypes: any[]): NSIndexSet;
    /**
     * @returns NSArray*
     * @param pasteboardType NSString*
     * @param itemSet NSIndexSet*
     */
    valuesForPasteboardTypeInItemSet(pasteboardType: string, itemSet: NSIndexSet): any[];
    /**
     * @returns NSArray*
     * @param pasteboardType NSString*
     * @param itemSet NSIndexSet*
     */
    dataForPasteboardTypeInItemSet(pasteboardType: string, itemSet: NSIndexSet): any[];
    /**
     * @param items NSArray*
     */
    addItems(items: any[]): void;
};

declare global {
    class UIPopoverController extends UIControl {
        delegate: any;
        constructor(viewController: UIViewController);
        presentPopoverFromRect(rect: CGRect, view: UIView, arrowDirections: number, animated: boolean): void;
        dismissPopoverAnimated(animated: boolean): void;
    }
}

declare class UIResponder {
    nextResponder: UIResponder;
    canBecomeFirstResponder(): boolean;
    becomeFirstResponder(): boolean;
    canResignFirstResponder(): boolean;
    resignFirstResponder(): boolean;
    isFirstResponder(): boolean;
}

declare global {
    class UISwitch extends UIControl {
        onTintColor: UIColor;
        on: boolean;
    }
}

declare const enum UITableViewStyle {
}
declare const enum UITableViewCellSeparatorStyle {
}
declare const enum UITableViewScrollPosition {
    /** Scrolls the cell to the bottom of the view. */
    Bottom = 3,
    /** Scrolls the row of interest to the middle of the view. */
    Middle = 2,
    /** Minimal scrolling to make the requested cell visible. */
    None = 0,
    /** Scrolls the row of interest to the top of the view. */
    Top = 1
}
declare const enum UITableViewRowAnimation {
    Fade = 0,
    Right = 1,
    Left = 2,
    Top = 3,
    Bottom = 4,
    None = 5,
    Middle = 6,
    Automatic = 7
}
declare class UITableView extends UIView {
    readonly style: UITableViewStyle;
    dataSource: any;
    rowHeight: CGFloat;
    separatorStyle: UITableViewCellSeparatorStyle;
    separatorColor?: UIColor;
    tableHeaderView?: UIView;
    tableFooterView?: UIView;
    backgroundView?: UIView;
    allowsSelection: boolean;
    /** not implemented */
    allowsSelectionDuringEditing: boolean;
    allowsMultipleSelectionDuringEditing: boolean;
    editing: boolean;
    sectionHeaderHeight: CGFloat;
    sectionFooterHeight: CGFloat;
    reloadData(): void;
    /**
     * @deprecated
     */
    reloadSectionIndexTitles(): void;
    /**
     * @deprecated
     */
    reloadSectionsWithRowAnimation(sections: number[], animation: UITableViewRowAnimation): void;
    /**
     * @deprecated
     */
    reloadRowsAtIndexPathsWithRowAnimation(indexPath: NSIndexPath[], animation: UITableViewRowAnimation): void;
    /**
     *  NSInteger
     */
    numberOfSections(): number;
    numberOfRowsInSection(section: number): number;
    rectForSection(section: number): CGRect;
    rectForHeaderInSection(section: number): CGRect;
    rectForFooterInSection(section: number): CGRect;
    /**
     *  @param indexPath NSIndexPath*
     */
    rectForRowAtIndexPath(indexPath: NSIndexPath): CGRect;
    /**
     *  @returns NSIndexPath*
     */
    indexPathForRowAtPoint(point: CGPoint): NSIndexPath;
    /**
     *  @returns NSIndexPath*
     */
    indexPathForCell(cell: UITableViewCell): NSIndexPath;
    /**
     *  @returns NSArray*
     */
    indexPathsForRowsInRect(rect: CGRect): any[];
    /**
     *  @param indexPath NSIndexPath*
     */
    cellForRowAtIndexPath(indexPath: NSIndexPath): UITableViewCell;
    /**
     *  @returns NSArray*
     */
    visibleCells(): any[];
    /**
     *  @returns NSArray*
     */
    indexPathsForVisibleRows(): any[];
    /**
     *  @returns UIView*
     *  NSInteger
     */
    headerViewForSection(section: number): UIView;
    /**
     *  @returns UIView*
     *  NSInteger
     */
    footerViewForSection(section: number): UIView;
    /**
     * @param indexPath NSIndexPath*
     */
    scrollToRowAtIndexPathAtScrollPositionAnimated(indexPath: NSIndexPath, scrollPosition: UITableViewScrollPosition, animated: boolean): void;
    scrollToNearestSelectedRowAtScrollPositionAnimated(scrollPosition: UITableViewScrollPosition, animated: boolean): void;
    setContentOffsetAnimated(offset: CGPoint, animated: boolean): void;
    rectForHeaderInSection(section: number): CGRect;
    rectForFooterInSection(section: number): CGRect;
    /**
     * @deprecated
     */
    deselectRowAtIndexPath(indexPath: NSIndexPath, animated: boolean): void;
}

declare const enum UITableViewCellSelectionStyle {
}
declare const enum UITableViewCellAccessoryTypeStyle {
}
declare const enum UITableViewCellStyle {
    Default = 0,
    Value1 = 1,
    Value2 = 2,
    Subtitle = 3
}
declare global {
    const UITableViewCell: {
        makeWithStyleReuseIdentifier(style: UITableViewCellStyle, reuseIdentifier: string): UITableViewCell;
    };
}
declare type UITableViewCell = {
    readonly contentView: UIView;
    readonly textLabel: UILabel;
    readonly detailTextLabel: UILabel;
    readonly imageView: UIImageView;
    hidden: boolean;
    indexPath: NSIndexSet;
    backgroundView: UIView;
    selectedBackgroundView: UIView;
    selectionStyle: UITableViewCellAccessoryTypeStyle;
    accessoryType: UITableViewCellSelectionStyle;
    selected: boolean;
    /** not available */
    setSelected(selected: boolean, animated: boolean): void;
};

declare class UITableViewController extends UIViewController {
    [k: string]: any;
    view: UIView;
    tableView?: UITableView;
    clearsSelectionOnViewWillAppear: boolean;
}

declare const enum NSTextAlignment {
    Left = 0,
    Center = 1,
    Right = 2,
    Justified = 3,
    Natural = 4
}
declare enum UITextBorderStyle {
}
declare global {
    class UITextField extends UIControl {
        [x: string]: any;
        constructor(frame?: CGRect);
        delegate: any;
        textColor: UIColor;
        background: UIImage;
        placeholder: string;
        textAlignment: NSTextAlignment;
        leftView: UIView;
        font: any;
        text: string;
        rightView: UIView;
        editing: boolean;
        borderStyle: UITextBorderStyle;
    }
}

declare class UIViewController {
    loadView(): void;
    viewWillUnload(): void;
    viewDidUnload(): void;
    viewDidLoad(): void;
    isViewLoaded(): void;
    viewWillAppear(animated: boolean): void;
    viewDidAppear(animated: boolean): void;
    viewWillDisappear(animate: boolean): void;
    viewDidDisappear(animate: boolean): void;
    viewWillLayoutSubviews(): void;
    viewDidLayoutSubviews(): void;
    didReceiveMemoryWarning(): void;
    isBeingPresented(): boolean;
    isBeingDismissed(): boolean;
    isMovingToParentViewController(): boolean;
    isMovingFromParentViewController(): boolean;
}

declare const enum UIViewAutoresizing {
}
declare global {

    class UIView extends UIResponder {
        static new():UIView;
        static animateWithDurationAnimationsCompletion(duration: number, animations: () => void, completion: () => void): void;
        constructor(frame?: CGRect);
        bounds: CGRect;
        frame: CGRect;
        layer: CALayer;
        hidden: boolean;
        autoresizingMask: UIViewAutoresizing;
        superview: UIView;
        subviews: UIView[];
        center: CGPoint;
        tag: number;
        autoresizesSubviews: boolean;
        backgroundColor: UIColor;
        convertRectToView(rect: CGRect, view: UIView): CGRect;
        removeFromSuperview(): void;
        convertPointToView(point: CGPoint, view: UIView): CGPoint;
        addSubview(view: UIView): void;
        bringSubviewToFront(view: UIView): void;
        addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;
        removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;
        isDescendantOfView(view:UIView):boolean;
    }
  declare class UITextView extends UIResponder {
        static new():UITextView;
        static animateWithDurationAnimationsCompletion(duration: number, animations: () => void, completion: () => void): void;
        constructor(frame?: CGRect);
        bounds: CGRect;
        frame: CGRect;
        layer: CALayer;
        hidden: boolean;
        autoresizingMask: UIViewAutoresizing;
        font: UIFont;
        textColor: UIColor;
        superview: UIView;
        subviews: UIView[];
        bounces:Boolean;
        center: CGPoint;
        tag: number;
        text:String;
        autoresizesSubviews: boolean;
        backgroundColor: UIColor;
        selectedRange: {location:Number,length:Number};
        convertRectToView(rect: CGRect, view: UIView): CGRect;
        removeFromSuperview(): void;
        convertPointToView(point: CGPoint, view: UIView): CGPoint;
        addSubview(view: UIView): void;
        addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;
        removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void;
    }
}

declare class CALayer {
    masksToBounds: boolean;
    frame: CGRect;
    cornerRadius: CGFloat;
    borderWidth: CGFloat;
    borderColor: UIColor;
    opacity: CGFloat;
    shadowOffset: CGSize;
    shadowRadius: number;
    shadowOpacity: number;
    shadowColor: UIColor;
}

declare const enum UIGestureRecognizerState {
}
declare const enum UISwipeGestureRecognizerDirection {
    Right = 1,
    Left = 2,
    Up = 4,
    Down = 8
}
declare global {
    class UIGestureRecognizer {
        constructor(target: any, action: string);
        state: UIGestureRecognizerState;
        delegate: any;
        enabled: boolean;
        view: UIView;
        cancelsTouchesInView: boolean;
        delaysTouchesBegan: boolean;
        delaysTouchesEnded: boolean;
        numberOfTouches(): number;
        addTargetAction(target: any, action: string): void;
        removeTargetAction(target: any, action: string): void;
        requireGestureRecognizerToFail(otherGestureRecognizer: UIGestureRecognizer): void;
        ignoreTouch(touch: UITouch): void;
        ignoreTouchForEvevnt(touch: UITouch, event: UIEvent): void;
        reset(): void;
        locationInView(view: UIView): CGPoint;
        translationInView(view: UIView): CGPoint;
    }
    class UITapGestureRecognizer extends UIGestureRecognizer {
        numberOfTapsRequired: number;
        numberOfTouchesRequired: number;
    }
    class UISwipeGestureRecognizer extends UIGestureRecognizer {
        direction: UISwipeGestureRecognizerDirection;
        numberOfTouchesRequired: number;
    }
    class UIPanGestureRecognizer extends UIGestureRecognizer {
    }
}

declare global {
    class UIScrollView extends UIView {
        static new():UIScrollView;
        constructor(frame: CGRect);
        contentOffset:CGPoint;
        contentSize:CGSize;
        delegate: any;
        showsVerticalScrollIndicator:Boolean;
        showsHorizontalScrollIndicator:Boolean;
        decelerating:Boolean;
        decelerationRate:CGFloat;
        directionalLockEnabled:Boolean;
        zooming:Boolean;
        alwaysBounceHorizontal:Boolean;
        pinchGestureRecognizer:any;
        scrollsToTop:Boolean;
        maximumZoomScale:CGFloat;
        minimumZoomScale:CGFloat;
        panGestureRecognizer:UIPanGestureRecognizer;
        scrollEnabled:Boolean;
        dragging:Boolean;
        bounces:Boolean;
        delaysContentTouches:Boolean;
        pagingEnabled:Boolean;
        zoomBouncing:Boolean;
        scrollIndicatorInsets:UIEdgeInsets;
        alwaysBounceVertical:Boolean;
        contentInset:UIEdgeInsets;
        bouncesZoom:Boolean;
        tracking:Boolean;
        indicatorStyle:any;
        zoomScale:CGFloat;
        canCancelContentTouches:Boolean;
        setContentOffsetAnimated(contentOffset:CGPoint,animated:Boolean):void;
        scrollRectToVisibleAnimated(rect:CGRect,animated:Boolean):void;
        flashScrollIndicators():void;
        setZoomScaleAnimated(scale:CGFloat,animated:Boolean):void;
        zoomToRectAnimated(rect:CGRect,animated:Boolean):void;
    }
}

declare global {
    class UIWebView extends UIView {
        constructor(frame: CGRect);
        [k: string]: any;
        scalesPageToFit: boolean;
        autoresizingMask: number;
        delegate: any;
        scrollView: any;
        loadFileURLAllowingReadAccessToURL(URL: NSURL, readAccessURL: NSURL): void;
        loadHTMLStringBaseURL(HTML:string):void;
        evaluateJavaScript(script: string, res: (res: string) => void): void;
    }
}
declare global {
    class UILabel extends UIView {
        constructor();
        text: string;
        font: UIFont;
        textColor: UIColor;
        textAlignment: NSTextAlignment;
        numberOfLines: number;
        lineBreakMode: number;
        opaque: boolean;
        adjustsFontSizeToFitWidth: boolean;
    }
}

declare type UIWindow = {
  screen:UIScreen,
  keyWindow:boolean,
  rootViewController:UIViewController,
  windowLevel:UIWindowLevel
};
declare type UILocalNotification = any;
declare type UIImageView = any;
declare type UITouch = any;
declare type CGFloat = number;
declare type CGBlendMode = any;
declare type CGPoint = {
    x: number;
    y: number;
};
declare type CGSize = {
    width: number;
    height: number;
};
declare type CGRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
declare global {
    const UIDevice: {
        currentDevice(): UIDevice;
    };
}
declare type UIDevice = {
    systemVersion: string;
};

/**
 * Can't read directly, use {@link NSValue2String} to convert to string
 */
declare type NSValue = {
    CGPointValue(): CGPoint;
    CGSizeValue(): CGSize;
    CGRectValue(): CGRect;
};

declare global {
    const NSUserDefaults: {
        standardUserDefaults(): NSUserDefaults;
        resetStandardUserDefaults(): void;
    };
}
declare type NSUserDefaults = {
    /**
     * @param defaultName NSString*
     */
    objectForKey(defaultName: string): any;
    /**
     * @param defaultName NSString*
     */
    setObjectForKey(value: any, defaultName: string): void;
    /**
     * @param defaultName NSString*
     */
    removeObjectForKey(defaultName: string): void;
    /**
     * @returns NSString*
     * @param defaultName NSString*
     */
    stringForKey(defaultName: string): string;
    /**
     * @returns NSArray*
     * @param defaultName NSString*
     */
    arrayForKey(defaultName: string): any[];
    /**
     * @returns NSDictionary*
     * @param defaultName NSString*
     */
    dictionaryForKey(defaultName: string): DictObj;
    /**
     * @returns NSData*
     * @param defaultName NSString*
     */
    dataForKey(defaultName: string): NSData;
    /**
     * @returns NSArray*
     * @param defaultName NSString*
     */
    stringArrayForKey(defaultName: string): any[];
    /**
     * @returns NSInteger
     * @param defaultName NSString*
     */
    integerForKey(defaultName: string): number;
    /**
     * @returns float
     * @param defaultName NSString*
     */
    floatForKey(defaultName: string): number;
    /**
     * @returns double
     * @param defaultName NSString*
     */
    doubleForKey(defaultName: string): number;
    /**
     * @param defaultName NSString*
     */
    boolForKey(defaultName: string): boolean;
    /**
     * @returns NSURL*
     * @param defaultName NSString*
     */
    URLForKey(defaultName: string): NSURL;
    /**
     * @param value NSInteger
     * @param defaultName NSString*
     */
    setIntegerForKey(value: number, defaultName: string): void;
    /**
     * @param value float
     * @param defaultName NSString*
     */
    setFloatForKey(value: number, defaultName: string): void;
    /**
     * @param value double
     * @param defaultName NSString*
     */
    setDoubleForKey(value: number, defaultName: string): void;
    /**
     * @param defaultName NSString*
     */
    setBoolForKey(value: boolean, defaultName: string): void;
    /**
     * @param url NSURL*
     * @param defaultName NSString*
     */
    setURLForKey(url: NSURL, defaultName: string): void;
    /**
     * @param registrationDictionary NSDictionary*
     */
    registerDefaults(registrationDictionary: DictObj): void;
    /**
     * @param suiteName NSString*
     */
    addSuiteNamed(suiteName: string): void;
    /**
     * @param suiteName NSString*
     */
    removeSuiteNamed(suiteName: string): void;
    /**
     * @returns NSDictionary*
     */
    dictionaryRepresentation(): DictObj;
    /**
     * @returns NSArray*
     */
    volatileDomainNames(): any[];
    /**
     * @returns NSDictionary*
     * @param domainName NSString*
     */
    volatileDomainForName(domainName: string): DictObj;
    /**
     * @param domain NSDictionary*
     * @param domainName NSString*
     */
    setVolatileDomainForName(domain: DictObj, domainName: string): void;
    /**
     * @param domainName NSString*
     */
    removeVolatileDomainForName(domainName: string): void;
    /**
     * @returns NSArray*
     */
    persistentDomainNames(): any[];
    /**
     * @returns NSDictionary*
     * @param domainName NSString*
     */
    persistentDomainForName(domainName: string): DictObj;
    /**
     * @param domain NSDictionary*
     * @param domainName NSString*
     */
    setPersistentDomainForName(domain: DictObj, domainName: string): void;
    /**
     * @param domainName NSString*
     */
    removePersistentDomainForName(domainName: string): void;
    synchronize(): boolean;
    /**
     * @param key NSString*
     */
    objectIsForcedForKey(key: string): boolean;
    /**
     * @param key NSString*
     * @param domain NSString*
     */
    objectIsForcedForKeyInDomain(key: string, domain: string): boolean;
};

declare global {
    const NSIndexSet: {
        indexSetWithIndex(index: number): NSIndexSet;
    };
}
declare type NSIndexSet = {
    isEqualToIndexSet(indexSet: NSIndexSet): boolean;
    firstIndex(): number;
    lastIndex(): number;
};

/**
 * callback function
 */
declare type JSValue = any;
/**
 * JSON Object
 */
declare type NSDictionary = any;
declare type NSRange = {location:number,length:number};
declare type NSMutableArray<T = any> = T[];
declare type NSCharacterSet = any;
declare type NSIndexPath = {
    row: number;
    section: number;
};
declare type NSNull = typeof NSNull;
declare global {
    const NSIndexPath: {
        indexPathForRowInSection(row: number, section: number): NSIndexPath;
    };
    class NSNull {
        static new(): NSNull;
    }
    const NSUUID: {
        UUID(): {
            /** have \- */
            UUIDString(): string;
        };
    };
}

declare const enum NotebookType {
    Hiden = 0,
    Doc = 1,
    MindMap = 2,
    FlashCard = 3
}
interface TextContent {
    /**
     * @example
     * String.fromCharCode(Number(char))
     */
    readonly char: string;
    readonly rect: NSValue;
}
/**
 * MarginNote document object
 */
declare class MbBook {
    /**
     * Last notebook which the document is in and opened
     */
    readonly currentTopicId?: string;
    /**
     * Date of last visit
     */
    readonly lastVisit?: Date;
    /**
     * docMd5 of the document
     */
    readonly docMd5?: string;
    /**
     * pathFile of the document
     */
    readonly pathFile?: string;
    /**
     * Title of the document
     */
    readonly docTitle?: string;
    /**
     * Page count of the document
     */
    readonly pageCount: number;
    /**
     * Content of text layer of the document, not including OCR Pro layer
     * Each row and each character is an element of the array
     */
    textContentsForPageNo(pageNo: number): TextContent[][];
}
/**
 * MarginNote notebook object
 */
declare class MbTopic {
    /**
     * notebook title, can be modified
     */
    title?: string;
    /**
     * nodebook id
     */
    readonly topicId?: string;
    readonly lastVisit?: Date;
    /**
     * main document md5
     */
    readonly mainDocMd5?: string;
    readonly historyDate?: Date;
    readonly syncMode?: number | boolean;
    readonly categoryList?: string;
    readonly hashtags?: string;
    readonly docList?: string;
    readonly options?: DictObj;
    /**
     * doucments in the notebook
     */
    readonly documents?: MbBook[];
    /**
     * notes in the notebook
     */
    readonly notes?: MbBookNote[];
    readonly flags: NotebookType;
    hideLinksInMindMapNode: boolean;
}
/**
 * MarginNote database object
 */
declare class MbModelTool {
    getNotebookById(notebookid: string): MbTopic | undefined;
    getMediaByHash(hash: string): NSData | undefined;
    getNoteById(noteid: string): MbBookNote | undefined;
    getDocumentById(md5: string): MbBook | undefined;
    /**
     * Get note in review mode
     */
    getFlashcardByNoteId(noteid: string, notebookid: string): MbBookNote | undefined;
    /**
     * Get notes in review mode
     */
    getFlashcardsByNoteId(noteid: string): MbBookNote[] | undefined;
    /**
     * Whether has note in review mode
     */
    hasFlashcardByNoteId(noteid: string): boolean;
    savedb(): void;
    /**
     * Fetch all notebooks
     */
    allNotebooks(): MbTopic[];
    /**
     * Fetch all documents
     */
    allDocuments(): MbBook[];
    setNotebookSyncDirty(notebookid: string): void;
    saveHistoryArchiveKey(notebookid: string, key: string): any[];
    loadHistoryArchiveKey(notebookid: string, key: string): any[];
    deleteBookNote(noteid: string): void;
    /**
     * Delete note and its all descendant notes
     */
    deleteBookNoteTree(noteid: string): void;
    /**
     * Clone notes to a notebook, and return the cloned notes
     */
    cloneNotesToTopic(notes: MbBookNote[], notebookid: string): string[];
    cloneNotesToFlashcardsToTopic(notes: MbBookNote[], notebookid: string): MbBookNote[];
    exportNotebookStorePath(notebookid: string, storePath: string): boolean;
    importNotebookFromStorePathMerge(storePath: string, merge: boolean): any;
    /**
     * Get handwriting notes in notebook mindmap
     */
    getSketchNotesForMindMap(notebookid: string): MbBookNote[];
    getSketchNotesForDocumentMd5Page(notebookid: string, docmd5: string, page: number): MbBookNote[];
}
declare global {
    const Database: {
        sharedInstance(): MbModelTool;
        /**
         * Transfrom unreadable OC dictionary to JS compatible
         */
        transDictionaryToJSCompatible(dic: any): any;
        /**
         * Transfrom unreadable OC array to JS compatible
         */
        transArrayToJSCompatible(arr: any): any;
    };
}

/**
 * Note comments
 * @see {@link MbBookNote.comments}
 */
declare type NoteComment = TextComment | HtmlComment | LinkComment | PaintComment;
/**
 * Basic Comment, just text you typed
 * @see {@link NoteComment}
 */
interface TextComment {
    type: "TextNote";
    /**
     * Get the content of the comment
     */
    text: string;
    /**
     * NoteID of the note, is only valid after merging the notes
     */
    noteid?: string;
}
/**
 * Generate when html copied to note
 * @see {@link NoteComment}
 */
interface HtmlComment {
    type: "HtmlNote";
    /**
     * Size of the render image
     */
    htmlSize: DictObj;
    /**
     * RTF
     */
    rtf: DictObj;
    /**
     * HTML code
     */
    html: string;
    /**
     * Text
     */
    text: string;
    /**
     * NoteID of the note
     */
    noteid?: string;
}
/**
 * Picture comment
 * @see {@link NoteComment}
 */
interface PaintComment extends MNPic {
    type: "PaintNote";
}
/**
 * It not means link to another note and it will be generated when merge notes.
 * The notes merged into is the LinkComment
 * @see {@link NoteComment}
 */
declare type LinkComment = LinkCommentText | LinkCommentPic;
/**
 * @see {@link LinkComment}
 */
interface LinkCommentText {
    type: "LinkNote";
    /**
     * NoteID of the note
     */
    noteid: string;
    /**
     * Text of the comment
     */
    q_htext: TextComment["text"];
}
/**
 * @see {@link LinkComment}
 */
interface LinkCommentPic {
    type: "LinkNote";
    /**
     * NoteID of the note
     */
    noteid: string;
    /**
     * Text of the comment : {@link TextComment.text}
     */
    q_htext?: TextComment["text"];
    /**
     * Image of the comment : {@link MNPic}
     */
    q_hpic: MNPic;
}

declare const enum GroupMode {
    Tree = 0,
    Frame = 1
}
/**
 * Notes of excerpt, mindmap nodes, and flashcards
 * @see {@link NodeNote} for better usage
 */
declare global {
  class MbBookNote {
    /**
     * Excerpt text of the note
     */
    excerptText?: string;
    /**
     * Title of the note
     */
    noteTitle?: string;
    /**
     * A int value, 0-15
     * Index of the color
     */
    colorIndex: number;
    /**
     * A int value, 0-2
     * Index of the fill type
     */
    fillIndex: number;
    /**
     * @deprecated
     * not working
     */
    mindmapPosition: CGPoint;
    /**
     * Note id
     */
    readonly noteId: string;
    /**
     * MD5 of the document
     */
    readonly docMd5?: string;
    /**
     * Notebook id
     */
    readonly notebookId?: string;
    /**
     * Page number of the start position of the note
     */
    readonly startPage?: number;
    /**
     * Page number of the end position of the note
     */
    readonly endPage?: number;
    /**
     * Start position of the note, like x,y
     */
    readonly startPos?: string;
    /**
     * End position of the note, like x,y
     */
    readonly endPos?: string;
    /**
     * Excerpt picture of the note, just the area of you selected
     */
    readonly excerptPic?: ExcerptPic;
    /**
     * Date of the note created
     */
    readonly createDate: Date;
    /**
     * Date of the note modified
     */
    readonly modifiedDate?: Date;
    /**
     * List of media hash value seprated by '-'
     * @example
     * "mediaHash1-mediaHash2-mediaHash3"
     * note.mediaList?.split("-").map(hash => MN.db.getMediaByHash(hash))
     */
    readonly mediaList?: string;
    /**
     * Origin note id, will be valid after merging
     */
    readonly originNoteId?: string;
    /**
     * Whether the note branch in mindmap is closed
     */
    readonly mindmapBranchClose?: number;
    /**
     * All the note text
     */
    readonly notesText?: string;
    /**
     * It Will be valid after merging itself into another note. It's the note id of the note it merged into.
     * @deprecated MarginNote v4.0
     */
    readonly groupNoteId?: string;
    /**
     * just the same as {@link MbBookNote.groupNoteId} in MarginNote v4.0
     */
    realGroupNoteIdForTopicId?(nodebookid: string): string;
    /**
    //  * Comments of the note, different from the excerptText
     */
    readonly comments: NoteComment[];
    /**
     * Parent-notes of the note
     */
    readonly parentNote?: MbBookNote;
    /**
     * List of Linked-note ID, used to locate the linked note card
     */
    readonly linkedNotes: {
        summary: boolean;
        /**
         * nodeid of the linked note
         */
        noteid: string;
        /**
         * text of the linked note
         */
        linktext: string;
    }[];
    /**
     * Child-notes of the note
     */
    readonly childNotes?: MbBookNote[];
    /**
     * Array of summarized note-id
     */
    readonly summaryLinks: string[];
    /**
     * A int value
     */
    readonly zLevel?: number;
    /**
     * Whether the card is hidden
     */
    readonly hidden?: boolean;
    /**
     * A int value
     */
    readonly toc?: number;
    readonly annotation?: boolean;
    /**
     * Whether the image has been OCR to text
     */
    readonly textFirst: boolean;
    /**
     * Mindmap group mode of the node branch
     */
    readonly groupMode?: GroupMode;
    /**
     * A int value
     * Whether the note has a flashcard
     */
    readonly flashcard?: number;
    /**
     * A int value
     */
    readonly summary: number;
    /**
     * A int value
     */
    readonly flagged?: number;
    readonly textHighlight?: {
        highlight_text: string;
        coords_hash: string;
        maskList?: string[];
        textSelLst?: any[];
    };
    readonly options?: DictObj;
    paste(): void;
    /**
     * Clear format of the note
     */
    clearFormat(): void;

    allNoteText(): string;
    /**
     * Merge another note to this note
     */
    merge(note: MbBookNote): void;
    /**
     * Append HTML comment to the note
     * @param html HTML text of the comment
     * @param text Pure text of the comment
     * @param size Size of the comment
     * @param tag Markdown editor plugin id. The HTML comment will be rendered by the plugin.
     * @example
     * note.appendHtmlComment(
     *    "```math\n" + res + "\n```",
     *    res,
     *    { width: 420, height: 100 },
     *    "MarkDownEditor"
     *  )
     */
    appendHtmlComment(html: string, text: string, size: CGSize, tag: string): void;
    /**
     * Append one text comment to the note
     */
    appendTextComment(text: string): void;
    /**
     * Append one text comment to the note, but it will be rendered as Markdown
     */
    appendMarkdownComment?(text: string): void;
    /**
     * Append Note Link to the note
     */
    appendNoteLink(note: MbBookNote): void;
    /**
     * Remove comment by index
     */
    removeCommentByIndex(index: number): void;
    /**
     * Number of handwritten strokes
     */
    getStrokesCount(): number;
  }
}
/**
 * Base type of the picture in MarginNote
 */
interface MNPic {
    /**
     * A hash value. Use it to get the picture from {@link MN.db.getMediaByHash} and encode it to base64
     * @example
     * MN.db.getMediaByHash(pic.paint)?.base64Encoding()
     */
    paint: string;
    /**
     * CGSize, use {@link CGSizeValue2CGSize} to convert it to {@link CGSize}
     */
    size: NSValue;
}
/**
 * The area of the excerpt
 */
interface ExcerptPic extends MNPic {
    selLst: {
        [key: number]: {
            /**
             * Rotation of the picture
             */
            rotation: number;
            /**
             * CGRect Value, the position of the picture in the note
             * use {@link CGRectValue2CGRect} to convert it to {@link CGRect}
             */
            rect: NSValue;
            /**
             * CGRect Value, same as rect
             */
            imgRect: NSValue;
            pageNo: number;
        };
    };
}
declare global {
    const Note: {
        /**
         * Used to create a new note with title, notebook and document.
         * It can't be created to a specific position now.
         * @returns MbBookNote*
         * @example
         * Note.createWithTitleNotebookDocument('title', current-topic, current-book)
         */
        createWithTitleNotebookDocument(title: string, notebook: MbTopic, doc: MbBook): MbBookNote;
    };
}

declare const enum OSType {
    iPadOS = 0,
    iPhoneOS = 1,
    macOS = 2
}
declare const enum StudyMode {
    doc0 = 0,
    doc1 = 1,
    /**
     * Mindmap mode
     */
    study = 2,
    review = 3
}
declare const enum DocMapSplitMode {
    allMap = 0,
    half = 1,
    allDoc = 2
}
declare class DocumentController {
    readonly document?: MbBook;
    /**
     * MD5 of the document.
     */
    readonly docMd5?: string;
    /**
     * ID of Notebook
     */
    readonly notebookId?: string;
    /**
     * Focus note of document, usually the note you are clicking on
     */
    readonly focusNote?: MbBookNote;
    /**
     * Last focus note, only valid when you are selecting text
     */
    readonly lastFocusNote?: MbBookNote;
    /**
     * Visible focus note
     */
    readonly visibleFocusNote?: MbBookNote;
    /**
     * Text you are selecting
     */
    readonly selectionText?: string;
    /**
     * Image from selection, usually converted to base64 to use.
     */
    imageFromSelection(): NSData;
    /**
     * Image from focusNode
     */
    imageFromFocusNote(): NSData;
    /**
     * start from 1. The virtual page has a large number of discontinuous pages
     * */
    readonly currPageNo: number;
    /**
     * start from 0, but if page deleted, the index will be 0.
     * */
    readonly currPageIndex: number;
    /**
     * convert page index to page number
     */
    indexFromPageNo(pageNo: number): number;
    /**
     * convert page number to page index
     */
    pageNoFromIndex(index: number): number;
    /**
     * Jump to the page index
     */
    setPageAtIndex(index: number): void;
    /**
     * Get all page indices from page number, which is not one-to-one mapping.
     */
    indicesFromPageNo(pageNo: number): number[];
}
/**
 * MindMap Node
 */
declare class MindMapNode {
    readonly note: MbBookNote;
    readonly parentNode?: MindMapNode;
    readonly summaryLinks?: any[];
    readonly childNodes?: MindMapNode[];
    /**
     * Node rect in mindmap view
     */
    readonly frame: CGRect;
}
/**
 * View of MindMap
 */
declare class MindMapView extends UIView {
    /**
     * MindMap Nodes
     */
    readonly mindmapNodes?: MindMapNode[];
    /**
     * Nodes of selected
     */
    readonly selViewLst?: {
        note: MindMapNode;
        view: UIView;
    }[];
}
/**
 * Controller of notebook
 */
declare class NotebookController {
    /**
     * View of notebook Controller
     */
    readonly view: UIView;
    /**
     * Outline view
     */
    readonly outlineView: OutlineView;
    /**
     * MindMap view
     */
    readonly mindmapView: MindMapView;
    /**
     * Notebook id
     */
    readonly notebookId?: string;
    /**
     * Focus note
     */
    readonly focusNote?: MbBookNote;
    /**
     * Visible focus note
     */
    readonly visibleFocusNote?: MbBookNote;
}
/**
 * Outline view
 */
declare class OutlineView {
    noteFromIndexPath(indexPath: NSIndexPath): MbBookNote;
}
/**
 * Reader Controller
 */
declare class ReaderController {
    readonly currentDocumentController: DocumentController;
    /**
     * Document controllers
     */
    readonly documentControllers?: DocumentController[];
    /**
     * view of ReaderController
     * {@link UIView}
     */
    view: UIView;
}
/**
 * Study Controller
 */
declare class StudyController extends UIViewController {
    /**
     * View of the study controller
     */
    view: UIView;
    /**
     * Study Mode
     */
    readonly studyMode: StudyMode;
    /**
     * Narrow Mode
     */
    readonly narrowMode: boolean;
    /**
     * DocMap Split Mode
     * {@link DocMapSplitMode}
     */
    docMapSplitMode: DocMapSplitMode;
    /**
     * Right Map Mode
     */
    rightMapMode: boolean;
    /**
     * Get notebook controller
     */
    readonly notebookController: NotebookController;
    /**
     * Get reader controller
     */
    readonly readerController: ReaderController;
    /**
     * @param noteId NSString*
     */
    focusNoteInMindMapById(noteId: string): void;
    /**
     * @param noteId NSString*
     */
    focusNoteInDocumentById(noteId: string): void;
    refreshAddonCommands(): void;
}
declare global {

class ApplicationInstance {
    /**
     * @value 4.0.2(97)
     *
     * 4.0.2 is version, 97 is build num
     */
    readonly appVersion: string;
    /**
     * @value 4.0.2(97)
     */
    readonly build: string;
    /**
     * Current theme
     */
    readonly currentTheme: "Gray" | "Default" | "Dark" | "Green" | "Sepia";
    /**
     * default tint color for dark background
     */
    readonly defaultTintColorForDarkBackground?: UIColor;
    /**
     * default tint color for selected
     */
    readonly defaultTintColorForSelected?: UIColor;
    /**
     * default tint color
     */
    readonly defaultTintColor?: UIColor;
    /**
     * default book page color
     */
    readonly defaultBookPageColor?: UIColor;
    /**
     * default note book color
     */
    readonly defaultNotebookColor?: UIColor;
    /**
     * default text color
     */
    readonly defaultTextColor?: UIColor;
    /**
     * default disable color
     */
    readonly defaultDisableColor?: UIColor;
    /**
     * default highlight blend color
     */
    readonly defaultHighlightBlendColor?: UIColor;
    /**
     * Focus window
     */
    readonly focusWindow?: UIWindow;
    /**
     * Database path
     */
    readonly dbPath?: string;
    /**
     * Document relative path
     */
    readonly documentPath?: string;
    /**
     * Cache path
     */
    readonly cachePath?: string;
    /**
     * Temp path
     */
    readonly tempPath?: string;
    /**
     * OS type
     */
    readonly osType: OSType;
    /**
     * Refresh Note data
     */
    refreshAfterDBChanged(notebookid: string): void;
    queryCommandWithKeyFlagsInWindow(command: string, keyFlags: number, window: UIWindow): DictObj;
    processCommandWithKeyFlagsInWindow(command: string, keyFlags: number, window: UIWindow): void;
    /**
     */
    openURL(url: NSURL): void;
    /**
     */
    alert(message: string): void;
    /**
     */
    showHUD(message: string, view: UIView, duration: number): void;
    /**
     */
    waitHUDOnView(message: string, view: UIView): void;
    /**
     */
    stopWaitHUDOnView(view: UIView): void;
    /**
     */
    saveFileWithUti(mfile: string, uti: string): void;
    /**
     */
    studyController(window: UIWindow): StudyController;
    /**
     * Check the notify sender is current window.
     * @param obj Usually sender
     * @param window
     */
    checkNotifySenderInWindow(obj: any, window: UIWindow): boolean;
    /**
     */
    openFileWithUTIs(types: string[], controller: UIViewController, callback: (file: string) => void): void;
    /**
     * Register a html comment editor
     * @param commentTag The markdown editor plugin id
     * @see "https://github.com/marginnoteapp/milkdown/blob/main/src/jsExtension/lifeCycle.ts#L80"
     */
    regsiterHtmlCommentEditor(commentEditor: DictObj, htmlEditor: JSValue, htmlRender: JSValue, commentTag: string): void;
    /**
     * Unregister a html comment editor
     * @param commentTag The markdown editor plugin id
     */
    unregsiterHtmlCommentEditor(commentTag: string): void;
}
    /**
     * Application class
     */
    const Application: {
        /**
         * Create an Application instance
         */
        sharedInstance(): ApplicationInstance;
    };
}

declare global {
    /**
     * Application class
     */
    const customController: {
        view:UIView;
    };
}

declare global {
    /**
     * Speech text
     */
    const SpeechManager: {
        sharedInstance(): SpeechManager;
    };
    /**
     * Undo
     */
    const UndoManager: {
        sharedInstance(): UndoManager;
    };
    /**
     * zip & unzip tools
     */
    const ZipArchive: {
        initWithPath(path: string): ZipArchive;
        unzipFileAtPathToDestination(path: string, destination: string): boolean;
        unzipFileAtPathToDestinationOverwritePassword(path: string, destination: string, overwrite: boolean, password: string): boolean;
        createZipFileAtPathWithFilesAtPaths(path: string, filenames: any[]): boolean;
        createZipFileAtPathWithContentsOfDirectory(path: string, directoryPath: string): boolean;
    };
    class MenuController extends UIViewController {
        /**
         * new instance
         */
        static new(): MenuController;
        menuTableView?: UITableView;
        commandTable?: {
            title: string;
            /** OC Object */
            object: any;
            selector: string;
            height?: number;
            param: Record<string, any>;
            checked: boolean;
        }[];
        sections?: any[];
        rowHeight: number;
        secHeight: number;
        fontSize: number;
        preferredContentSize: {
            width: number;
            height: number;
        };
    }
}
declare type SpeechManager = {
    /**
     * start speech notes
     */
    startSpeechNotes(notes: any[]): void;
    /**
     * stop speech
     */
    stopSpeech(): void;
    /**
     * pause speech
     */
    pauseSpeech(): void;
    /**
     * continue speech
     */
    continueSpeech(): void;
    /**
     * previous speech
     */
    prevSpeech(): void;
    /**
     * next speech
     */
    nextSpeech(): void;
    canPrev(): boolean;
    canNext(): boolean;
    playText(text: string): void;
    playTextLanguageTxt(text: string, languageTxt: string): void;
    /**
     * If speaking
     */
    readonly speaking: boolean;
    /**
     * If paused
     */
    readonly paused: boolean;
    /**
     * when speak text
     */
    readonly sysSpeaking: boolean;
    /**
     * Scene window
     */
    sceneWindow?: UIWindow;
    languageCode?: string;
};
declare type UndoManager = {
    undoGrouping(actionName: string, notebookid: string, block: JSValue): void;
    /**
     * undo an action
     */
    undo(): void;
    /**
     * redo an action
     */
    redo(): void;
    /**
     * if can undo
     */
    canUndo(): boolean;
    /**
     * if can redo
     */
    canRedo(): boolean;
    /**
     * clear all actions
     */
    clearAll(): void;
};
declare type ZipArchive = {
    open(): boolean;
    writeFile(path: string): boolean;
    writeDataFilename(data: NSData, filename: string): boolean;
    close(): boolean;
};

declare global {
    const SQLiteDatabase: {
        databaseWithPath(path: string): SQLiteDatabase;
    };
}
declare type SQLiteDatabase = {
    open(): boolean;
    close(): boolean;
    goodConnection(): boolean;
    executeQueryWithArgumentsInArray(sql: string, args: any[]): SQLiteResultSet;
    executeQueryWithParameterDictionary(sql: string, args: object): SQLiteResultSet;
    executeUpdateWithParameterDictionary(sql: string, args: object): boolean;
    executeUpdateWithArgumentsInArray(sql: string, args: any[]): boolean;
    executeStatements(sql: string):boolean;
};
declare class SQLiteResultSet {
    stringForColumn(columnName: string): string;
    intForColumn(columnName: string): number;
    next(): boolean;
    close(): void;
    resultDictionary(): DictObj;
}

/**
 * Addon of MarginNote
 */
declare class JSExtension {
    [k: string]: any;
    readonly window?: UIWindow;
    /**
     * Query Addon Status, usally used for checking if activate the addon
     * @returns NSDictionary*
     */
    queryAddonCommandStatus(): {
        /**
         * path to icon file
         * image size must be 44x44 px
         */
        image: string;
        /**
         * object of the function, usually self
         */
        object: any;
        /**
         * selector of the function, for another word, when you click(tap) on the icon, what function will be executed
         * @example
         * toggle:
         */
        selector: string;
        /**
         * checked status
         */
        checked: boolean;
    } | null;
    additionalTitleLinksOfNotebook(notebookid: string): any[];
    viewControllerForTitleLink(titleLink: string): UIViewController;
    controllerWillLayoutSubviews(controller: UIViewController): void;
    additionalShortcutKeys(): any[];
    queryShortcutKeyWithKeyFlags(command: string, keyFlags: number): DictObj;
    processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void;
}
/**
 * LifeCycle of Addon
 */
declare namespace JSExtensionLifeCycle {
    type InstanceMethods = Partial<{
        /**
         * Do something when MarginNote open a window
         * @returns void
         */
        sceneWillConnect(): void;
        /**
         *  Do something when MarginNote close a window
         */
        sceneDidDisconnect(): void;
        /**
         * Do something when MarginNote window resign active
         */
        sceneWillResignActive(): void;
        /**
         * Do something when activate MarginNote window
         */
        sceneDidBecomeActive(): void;
        /**
         * Do something when notebook open
         * @param topicid NSString*
         */
        notebookWillOpen(notebookid: string): void;
        /**
         * Do something when notebook close
         * @param topicid NSString*
         */
        notebookWillClose(notebookid: string): void;
        /**
         * Do something when document open
         * @param docmd5 NSString*
         */
        documentDidOpen(docmd5: string): void;
        /**
         * Do something when document close
         * @param docmd5 NSString*
         * @returns void
         */
        documentWillClose(docmd5: string): void;
    }>;
    type ClassMethods = Partial<{
        /**
         * Do something when addon finish loading
         * @returns void
         */
        addonDidConnect(): void;
        /**
         * Do something when addon shuts down
         * @returns void
         */
        addonWillDisconnect(): void;
        /**
         * Do something when application enter background
         * @returns void
         */
        applicationDidEnterBackground(): void;
        /**
         * Do something when application enter foreground
         * @returns void
         */
        applicationWillEnterForeground(): void;
        /**
         * @param notify UILocalNotification*
         * @returns void
         */
        applicationDidReceiveLocalNotification(notify: UILocalNotification): void;
    }>;
}

declare global {
    const JSB: {
        defineClass(declaration: string, instanceMethods?: InstanceMethods, classMethods?: ClassMethods): any;
        require(name: string): any;
        log(format: string, arguments: string[] | string): void;
        dump(object: any): void;
        newAddon(mainPath: string): any;
    };
}
declare type DictObj = {
    [k: string]: any;
};

export {Application, CALayer, CGBlendMode, CGFloat, CGPoint, CGRect, CGSize, DictObj, DocMapSplitMode, DocumentController, ExcerptPic, GroupMode, HtmlComment, JSExtension, JSExtensionLifeCycle, JSValue, LinkComment, LinkCommentPic, LinkCommentText, MNPic, MbBook, MbBookNote, MbModelTool, MbTopic, MindMapNode, MindMapView, NSCharacterSet, NSData, NSDataReadingOptions, NSDataSearchOptions, NSDataWritingOptions, NSDictionary, NSError, NSFileManager, NSHTTPURLResponse, NSIndexPath, NSIndexSet, NSJSONReadingOptions, NSJSONSerialization, NSJSONWritingOptions, NSLineBreakMode, NSLocale, NSLocaleLanguageDirection, NSMutableArray, NSMutableURLRequest, NSNotification, NSNotificationCenter, NSNull, NSOperationQueue, NSRange, NSStringEncoding, NSTextAlignment, NSTimeInterval, NSTimer, NSURL, NSURLBookmarkCreationOptions, NSURLBookmarkFileCreationOptions, NSURLBookmarkResolutionOptions, NSURLConnection, NSURLRequest, NSURLResponse, NSUserDefaults, NSValue, NoteComment, NotebookController, NotebookType, OSType, OutlineView, PaintComment, ReaderController, SQLiteDatabase, SQLiteResultSet, SpeechManager, StudyController, StudyMode, TextComment, UIAlertView, UIAlertViewStyle, UIApplication, UIButtonType, UIColor, UIControl, UIControlEvents, UIControlState, UIDevice, UIEdgeInsets, UIEvent, UIFont, UIGestureRecognizerState, UIImage, UIImageOrientation, UIImageView, UILocalNotification, UIPasteboard, UIResponder, UIScrollView, UISwipeGestureRecognizerDirection, UITableView, UITableViewCell, UITableViewCellAccessoryTypeStyle, UITableViewCellSelectionStyle, UITableViewCellSeparatorStyle, UITableViewCellStyle, UITableViewController, UITableViewRowAnimation, UITableViewScrollPosition, UITableViewStyle, UITextBorderStyle, UITouch, UIViewAutoresizing, UIViewController, UIWindow, UndoManager, ZipArchive };
