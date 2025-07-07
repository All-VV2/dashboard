export function StatsBar() {
  return (
    <div className="border-t p-4 bg-muted/30">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-background p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.66 17 22 12 22C7 22 3 20.66 3 19V5M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Trash Collected</div>
            <div className="font-bold">200 pcs</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-background p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 10.9104 4.16968 9.91153 4.45962 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12L8 8M8 8H11.5M8 8V11.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Coverage</div>
            <div className="font-bold">75%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-background p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Rovers</div>
            <div className="font-bold">13 rovers</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-background p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.33789 17C3.33789 17.5523 3.78561 18 4.33789 18H19.3379C19.8902 18 20.3379 17.5523 20.3379 17C20.3379 16.4477 19.8902 16 19.3379 16H4.33789C3.78561 16 3.33789 16.4477 3.33789 17Z"
                fill="currentColor"
              />
              <path
                d="M6.30664 12.8369C6.30664 13.3892 6.75436 13.8369 7.30664 13.8369H16.3066C16.8589 13.8369 17.3066 13.3892 17.3066 12.8369C17.3066 12.2846 16.8589 11.8369 16.3066 11.8369H7.30664C6.75436 11.8369 6.30664 12.2846 6.30664 12.8369Z"
                fill="currentColor"
              />
              <path
                d="M9.30664 8.67383C9.30664 9.22611 9.75436 9.67383 10.3066 9.67383H13.3066C13.8589 9.67383 14.3066 9.22611 14.3066 8.67383C14.3066 8.12154 13.8589 7.67383 13.3066 7.67383H10.3066C9.75436 7.67383 9.30664 8.12154 9.30664 8.67383Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
            <div className="font-bold">92%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
