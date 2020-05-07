const ws = adonis.Ws(null, {
    query: {
      passcode: "123"
    }
  }).connect();
const form = document.querySelector('form');
const input = document.querySelector('#user-input');
const messages = document.querySelector('#messages');
const leaveButton = document.querySelector('#leave-button');
const joinedAs = document.querySelector('#joined-as');
const totalUsers = document.querySelector('total-users');
const userPasscode = document.querySelector('#chat-code');
const connectButton = document.querySelector('#connect-button');




ws.on('open', () => {
    const chat = ws.subscribe('chat');

    chat.on('error', (e) => {
        toastr.error(e.message);
        ws.close();
      });

    let usersSet;

    chat.on('chatMessage', (message) => {
        let li = document.createElement('li');
        li.textContent = message.body;
        messages.append(li);
      });

      chat.on('joined', ({ user }) => {
        userPasscode.classList.add("d-none");
        connectButton.classList.add("d-none");
        leaveButton.classList.remove("d-none");
        joinedAs.textContent = user;
        toastr.success(`Joined as ${user}`)
      });

      chat.on('joined', ({ users }) => {
        usersSet = new Set(users);
      });
    
      chat.on('joined', ({ users }) => {
        totalUsers.textContent = users.length;
      });
    
      chat.on('joined', ({ users }) => {
        let ul = document.createElement('ul');
        ul.id = 'joined-users';
    
        users.forEach((user) => {
          let li = document.createElement('li');
          li.textContent = user;
          ul.append(li);
        });
    
        let currentUl = document.querySelector('#joined-users');
        currentUl.replaceWith(ul);
      });
    
      chat.on('newUser', (user) => {
        usersSet.add(user);
    
        let li = document.createElement('li');
        li.textContent = user;
        document.querySelector('#joined-users').append(li);
    
        totalUsers.textContent = usersSet.size;
      });
    
      chat.on('userLeft', (user) => {
        usersSet.delete(user);
    
        let ul = document.createElement('ul');
        ul.id = 'joined-users';
    
        usersSet.forEach((user) => {
          let li = document.createElement('li');
          li.textContent = user;
          ul.append(li);
        });
    
        let currentUl = document.querySelector('#joined-users');
        currentUl.replaceWith(ul);
    
        totalUsers.textContent = usersSet.size;
      });
    
      chat.emit('userJoined');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let message = input.value;
        input.value = '';

        if(message.trim() != '')
        {
            chat.emit('chatMessage', {
                body: message
            });
        }
    });

    connectButton.addEventListener('click', function() {
        code = userPasscode.value;
        console.log(code);
        userPasscode.value = '';
    });

    leaveButton.addEventListener('click', function() {
        userPasscode.classList.remove("d-none");
        connectButton.classList.remove("d-none");
        leaveButton.classList.add("d-none");
        ws.getSubscription('chat').emit('userLeft');
        ws.close();
        this.disabled = true;
      });
    
      window.addEventListener('beforeunload', () => {
        ws.getSubscription('chat').emit('userLeft');
        ws.close();
      });
});